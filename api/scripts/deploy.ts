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
import { name } from "../package.json";

const args = minimist(process.argv.slice(3));
const version = args.version ?? os.userInfo().username;

const envVars = [
  `APP_NAME=${env.APP_NAME}`,
  `APP_ORIGIN=${env.APP_ORIGIN}`,
  `APP_VERSION=${version}`,
  `APP_ENV=${env.APP_ENV}`,
  `JWT_SECRET=${env.JWT_SECRET}`,
  `PGHOST=/cloudsql/${env.GOOGLE_CLOUD_SQL}`,
  `PGUSER=${env.PGUSER}`,
  `PGPASSWORD=${env.PGPASSWORD}`,
  `PGDATABASE=${env.PGDATABASE}`,
  `PGAPPNAME=${name}_${version}`,
];

spawn.sync(
  "gcloud",
  [
    `--project=${process.env.GOOGLE_CLOUD_PROJECT}`,
    `functions`,
    `deploy`,
    name,
    `--region=${process.env.GOOGLE_CLOUD_REGION}`,
    `--allow-unauthenticated`,
    `--entry-point=${name}`,
    `--memory=2GB`,
    `--runtime=nodejs12`,
    `--source=gs://${process.env.PKG_BUCKET}/${name}_${version}.zip`,
    `--timeout=30`,
    `--set-env-vars=${envVars.join(",")}`,
    `--trigger-http`,
  ],
  { stdio: "inherit" },
);
