/**
 * Deploys the "img" package to Google Cloud Functions (GCF). Usage:
 *
 *   $ yarn deploy [--env #0]
 *
 * @see https://cloud.google.com/functions
 * @see https://cloud.google.com/sdk/gcloud/reference/functions/deploy
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

require("env");
const path = require("path");
const spawn = require("cross-spawn");

const env = process.env;
const name = "img";

console.log(`Deploying ${name} to ${env.APP_ENV}...`);

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
    name,
    `--region=${env.GOOGLE_CLOUD_REGION}`,
    `--allow-unauthenticated`,
    `--entry-point=${name}`,
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
