/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { execa as $ } from "execa";
import { URL } from "node:url";
import { argv, chalk, fs, path } from "zx";
import { getApiOrigin } from "./utils.js";

const env = process.env;
const envName = argv.env ?? "test";
const version = argv.version ?? null;

// Load environment variables from the `/env/.{envName}.env` file
envars.config({ env: envName });

// Retrieve the URL of GraphQL API endpoint (Google Cloud Function)
// https://cloud.google.com/sdk/gcloud/reference/beta/functions
if (process.argv.includes("publish")) {
  env.API_ORIGIN = await getApiOrigin(version ? `api-${version}` : `api`);
}

// The name of the worker script given the target environment
//   $ yarn web:deploy --env=prod               => `proxy`
//   $ yarn web:deploy --env=test               => `proxy-test`
//   $ yarn web:deploy --env=test --version=22  => `proxy-test-22`
const envSuffix = envName === "prod" ? "" : `-${envName}`;
const versionSuffix = version ? `-${version}` : "";
const name = `${env.CLOUDFLARE_WORKER ?? "proxy"}${envSuffix}${versionSuffix}`;
const hostname = new URL(env.APP_ORIGIN).hostname;

// Configure Cloudflare Wrangler
// https://developers.cloudflare.com/workers/cli-wrangler/configuration
await fs.writeFile(
  "../web/dist/proxy.toml",
  `
    name = "${name}"
    main = "proxy.js"

    account_id = "${env.CLOUDFLARE_ACCOUNT_ID}"

    # https://developers.cloudflare.com/workers/platform/compatibility-dates/
    compatibility_date = "2022-04-18"

    routes = ["${hostname}/*"]

    [vars]
    APP_ENV = "${env.APP_ENV}"
    APP_NAME = "${env.APP_NAME}"
    APP_ORIGIN = "${env.APP_ORIGIN}"
    API_ORIGIN = "${env.API_ORIGIN}"
    FIREBASE_AUTH_KEY = "${env.FIREBASE_AUTH_KEY}"
    GOOGLE_CLOUD_PROJECT = "${env.GOOGLE_CLOUD_PROJECT}"
    GA_MEASUREMENT_ID = "${env.GA_MEASUREMENT_ID}"

    [site]
    bucket = "."
    exclude = ["proxy.js"]
  `.replace(/^\s+/gm, ""),
  { encoding: "utf-8" },
);

// Get the list of arguments excluding the --env/-e and --version flag
const args = process.argv
  .slice(3)
  .map((v, i, a) => {
    if (v?.startsWith("--env=") || v?.startsWith("-e=")) return undefined;
    if (v?.startsWith("--version=")) return undefined;
    if (v === "--env" || v === "-e") return (a[i + 1] = undefined);
    if (v === "--version") return (a[i + 1] = undefined);
    return v;
  })
  .filter(Boolean);

// Check if there is a secret name, e.g. `yarn web:cf secret put PRIVATE_KEY`
const secret = args.find((_, i) => args[i - 2] === "secret" && args[i - 1] === "put"); // prettier-ignore

// Spawn the Wrangler CLI process
const cmd = $("wrangler", ["--config", "proxy.toml", ...args], {
  stdio: secret && env[secret] ? ["pipe", "inherit", "inherit"] : "inherit",
  cwd: path.resolve(__dirname, "../web/dist"),
});

// Write the secret to stdin
if (secret && env[secret] && cmd.stdin) {
  cmd.stdin.write(env[secret]);
  cmd.stdin.end();
}

// Handle errors
cmd.catch((err) => {
  process.exitCode = err.exitCode;
  console.error("\n" + chalk.redBright(err.command));
  return Promise.resolve();
});
