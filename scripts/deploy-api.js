/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Deploys the "api" package to Google Cloud Functions (GCF). Usage:
 *
 *   $ yarn api:deploy [--env #0]
 *
 * @see https://cloud.google.com/functions
 * @see https://cloud.google.com/sdk/gcloud/reference/functions/deploy
 */

const envars = require("envars");
const spawn = require("cross-spawn");
const args = require("minimist")(process.argv.slice(2));

process.env.NODE_ENV = "production";
process.env.APP_ENV = args.env ?? process.env.APP_ENV ?? "test";

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env: process.env.APP_ENV });

// Load the list of environment variables required by the app
require("api/utils/babel-register");
const env = { ...require("api/env").default };

// Use Cloud SQL Proxy in Google Cloud Functions (GCF) environment
const region = process.env.GOOGLE_CLOUD_REGION;
env.PGHOST = `/cloudsql/${env.PGSERVERNAME.replace(":", `:${region}:`)}`;
env.PGAPPNAME = `api ${env.APP_ENV} ${new Date().toISOString()}`;
delete env.PGSSLMODE;
delete env.PGSSLCERT;
delete env.PGSSLKEY;
delete env.PGSSLROOTCERT;
delete env.PGSERVERNAME;

spawn(
  "gcloud",
  [
    `--project=${process.env.GOOGLE_CLOUD_PROJECT}`,
    `functions`,
    `deploy`,
    args.version ? `api_${args.version}` : `api`,
    `--region=${region}`,
    `--allow-unauthenticated`,
    `--entry-point=api`,
    `--memory=1GB`,
    `--runtime=nodejs14`,
    `--source=./dist`,
    `--timeout=30`,
    `--trigger-http`,
    `--set-env-vars=NODE_OPTIONS=-r ./.pnp.cjs -r source-map-support/register`,
    ...Object.keys(env).map((key) => `--set-env-vars=${key}=${env[key]}`),
  ],
  { stdio: "inherit" },
).on("error", (err) => {
  console.error(err);
  process.exit(1);
});
