/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { fileURLToPath, URL } from "node:url";
import { $, argv, cd, fs, path } from "zx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from the `/env/.{envName}.env` file
envars.config({ env: argv.env ?? "test" });
process.env.CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

// Get the URL of the API endpoint (Google Cloud Function)
// https://cloud.google.com/sdk/gcloud/reference/beta/functions
const API_URL = await $`gcloud beta functions describe api --gen2 ${[
  `--project=${process.env.GOOGLE_CLOUD_PROJECT}`,
  `--region=${process.env.GOOGLE_CLOUD_REGION}`,
  `--format=value(serviceConfig.uri)`,
]}`.then((cmd) => `${cmd.stdout.trim()}/api`);

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
    API_URL = "${API_URL}"
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
await $`yarn wrangler publish --verbose --config ../web/dist/wrangler.toml ${
  isProductionEnv ? [] : ["--env", envName]
}`;
