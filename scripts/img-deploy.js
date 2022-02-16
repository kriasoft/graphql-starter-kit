/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import minimist from "minimist";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { $ } from "zx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const args = minimist(process.argv.slice(2));
const env = envars.config({
  env: args.env || "test",
  cwd: path.relative(__dirname, "../env"),
});

// The list of required environment variables
const envVars = [
  `SOURCE_BUCKET=${env.STORAGE_BUCKET}`,
  `CACHE_BUCKET=${env.CACHE_BUCKET}`,
];

/**
 * Deploys the "img" package to Google Cloud Functions (GCF). Usage:
 *
 *   $ yarn img:deploy [--env #0]
 *
 * @see https://cloud.google.com/functions
 * @see https://cloud.google.com/sdk/gcloud/reference/functions/deploy
 */
await $`gcloud beta functions deploy img ${[
  `--project=${env.GOOGLE_CLOUD_PROJECT}`,
  `--region=${env.GOOGLE_CLOUD_REGION}`,
  `--allow-unauthenticated`,
  `--entry-point=img`,
  `--gen2`,
  `--memory=2GB`,
  `--runtime=nodejs16`,
  `--signature-type=http`,
  `--source=${path.resolve(__dirname, "../img")}`,
  `--timeout=30s`,
  `--set-env-vars=${envVars.join(",")}`,
  `--min-instances=0`,
  `--max-instances=4`,
  `--trigger-http`,
]}`;
