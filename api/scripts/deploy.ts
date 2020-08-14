/**
 * Deploys application bundle to Google Cloud Functions (GCF). Usage:
 *
 *   $ yarn deploy [--version=#0]
 *
 * @see https://cloud.google.com/functions
 * @see https://cloud.google.com/sdk/gcloud/reference/functions/deploy
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import "env";
import os from "os";
import spawn from "cross-spawn";
import minimist from "minimist";

import env from "../src/env";
import pkg from "../package.json";

const args = minimist(process.argv.slice(3));
const project = process.env.GOOGLE_CLOUD_PROJECT;
const region = process.env.GOOGLE_CLOUD_REGION;
const version = args.version ?? os.userInfo().username;

const envVars = [
  `APP_NAME=${env.APP_NAME}`,
  `APP_ORIGIN=${env.APP_ORIGIN}`,
  `APP_VERSION=${version}`,
  `APP_ENV=${env.APP_ENV}`,
  `JWT_SECRET=${env.JWT_SECRET}`,
  `JWT_EXPIRES=${env.JWT_EXPIRES}`,
  `PGHOST=/cloudsql/${project}:${region}:db`,
  `PGUSER=${env.PGUSER}`,
  `PGPASSWORD=${env.PGPASSWORD}`,
  `PGDATABASE=${env.PGDATABASE}`,
];

spawn.sync(
  "gcloud",
  [
    `--project=${process.env.GOOGLE_CLOUD_PROJECT}`,
    `functions`,
    `deploy`,
    pkg.name,
    `--region=${process.env.GOOGLE_CLOUD_REGION}`,
    `--allow-unauthenticated`,
    `--entry-point=${pkg.name}`,
    `--memory=2GB`,
    `--runtime=nodejs12`,
    `--source=gs://${process.env.PKG_BUCKET}/api_${version}.zip`,
    `--timeout=30`,
    `--set-env-vars=${envVars.join(",")}`,
    `--trigger-http`,
  ],
  { stdio: "inherit" },
);
