/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { execa as $ } from "execa";
import { URL } from "node:url";
import { argv, cd, chalk, fs, path } from "zx";

const apiFuncName = argv.version ? `api-${argv.version}` : "api";

// Load environment variables from the `/env/.{envName}.env` file
envars.config({ env: argv.env ?? "test" });
process.env.CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

// Get the URL of the API endpoint (Google Cloud Function)
// https://cloud.google.com/sdk/gcloud/reference/beta/functions
const API_ORIGIN = await $("gcloud", [
  ...["beta", "functions", "describe", apiFuncName, "--gen2"],
  ...["--project", process.env.GOOGLE_CLOUD_PROJECT],
  ...["--region", process.env.GOOGLE_CLOUD_REGION],
  ...["--format", "value(serviceConfig.uri)"],
]).then((cmd) => cmd.stdout.toString());

const hostname = new URL(process.env.APP_ORIGIN).hostname;
const envName = process.env.APP_ENV;
const isProductionEnv = envName === "prod";

// Configure Cloudflare Wrangler
// https://developers.cloudflare.com/workers/cli-wrangler/configuration
await fs.writeFile(
  path.resolve(__dirname, "../web/dist/wrangler.toml"),
  `
    name = "${process.env.CLOUDFLARE_WORKER ?? "proxy"}"
    type = "javascript"
    account_id = "${process.env.CLOUDFLARE_ACCOUNT_ID}"
    zone_id = "${process.env.CLOUDFLARE_ZONE_ID}"
    compatibility_date = "2022-02-19"
    ${isProductionEnv ? `` : `[env.${envName}]`}
    routes = ["${hostname}/*"]
    ${isProductionEnv ? `[vars]` : `[env.${envName}.vars]`}
    APP_ENV = "${envName}"
    APP_NAME = "${process.env.APP_NAME}"
    APP_ORIGIN = "${process.env.APP_ORIGIN}"
    API_ORIGIN = "${API_ORIGIN}"
    FIREBASE_AUTH_KEY = "${process.env.FIREBASE_AUTH_KEY}"
    GOOGLE_CLOUD_PROJECT = "${process.env.GOOGLE_CLOUD_PROJECT}"
    GA_MEASUREMENT_ID = "${process.env.GA_MEASUREMENT_ID}"
    [site]
    bucket = "${path.resolve(__dirname, "../web/dist/web")}"
    entry-point = "${path.resolve(__dirname, "../web/dist/workers")}"
    [build]
    command = ""
    [build.upload]
    format = "service-worker"
  `.replace(/^\s+/gm, ""),
  "utf-8",
);

// Create package.json file required by Cloudflare Wrangler CLI
await fs.writeFile(
  path.resolve(__dirname, "../web/dist/workers/package.json"),
  `{"main": "./proxy.js"}`,
  "utf-8",
);

// Deploy web application to Cloudflare Workers
// https://developers.cloudflare.com/workers/
cd(__dirname);
await $(
  "wrangler",
  [
    ...["publish", "--verbose", "--config", "../web/dist/wrangler.toml"],
    ...(isProductionEnv ? [] : ["--env", envName]),
  ],
  { stdio: "inherit", cwd: __dirname },
).catch((err) => {
  process.exitCode = err.exitCode;
  console.error("\n" + chalk.redBright(err.command));
  return Promise.resolve();
});
