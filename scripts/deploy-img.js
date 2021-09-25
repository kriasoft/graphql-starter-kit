/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Deploys the "img" package to Google Cloud Functions (GCF). Usage:
 *
 *   $ yarn img:deploy [--env #0]
 *
 * @see https://cloud.google.com/functions
 * @see https://cloud.google.com/sdk/gcloud/reference/functions/deploy
 */

const path = require("path");
const envars = require("envars");
const minimist = require("minimist");
const spawn = require("cross-spawn");

// Load environment variables
const args = minimist(process.argv.slice(2));
const env = envars.config({
  env: args.env || "test",
  cwd: path.relative(__dirname, "../env"),
});

console.log(`Deploying "img" to the "${process.env.APP_ENV}" environment...`);

const envVars = [
  `SOURCE_BUCKET=${env.STORAGE_BUCKET}`,
  `CACHE_BUCKET=${env.CACHE_BUCKET}`,
];

spawn(
  "gcloud",
  [
    `--project=${env.GOOGLE_CLOUD_PROJECT}`,
    `functions`,
    `deploy`,
    "img",
    `--region=${env.GOOGLE_CLOUD_REGION}`,
    `--allow-unauthenticated`,
    `--entry-point=img`,
    `--memory=2GB`,
    `--runtime=nodejs14`,
    `--source=.`,
    `--timeout=30`,
    `--set-env-vars=${envVars.join(",")}`,
    `--trigger-http`,
  ],
  {
    stdio: "inherit",
    cwd: path.resolve(__dirname, "../img"),
  },
).on("error", (err) => {
  console.error(err);
  process.exit(1);
});
