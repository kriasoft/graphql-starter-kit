/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { execa as $ } from "execa";
import { argv, chalk, path } from "zx";

// Load environment variables
const env = envars.config({ env: argv.env ?? "test" });

/**
 * Deploys the "img" package to Google Cloud Functions (GCF). Usage:
 *
 *   $ yarn img:deploy [--env #0]
 *
 * @see https://cloud.google.com/functions
 * @see https://cloud.google.com/sdk/gcloud/reference/functions/deploy
 */
await $(
  `gcloud`,
  [
    ...["beta", "functions", "deploy", "img"],
    `--project=${env.GOOGLE_CLOUD_PROJECT}`,
    `--region=${env.GOOGLE_CLOUD_REGION}`,
    `--allow-unauthenticated`,
    `--entry-point=img`,
    `--gen2`,
    `--memory=2GB`,
    `--runtime=nodejs16`,
    `--source=.`,
    `--timeout=30s`,
    `--set-env-vars=SOURCE_BUCKET=${env.STORAGE_BUCKET}`,
    `--set-env-vars=CACHE_BUCKET=${env.CACHE_BUCKET}`,
    `--min-instances=0`,
    `--max-instances=4`,
    `--trigger-http`,
  ],
  { stdio: "inherit", cwd: path.resolve(__dirname, "../img") },
).catch((err) => {
  process.exitCode = err.exitCode;
  console.error("\n" + chalk.redBright(err.command));
  return Promise.resolve();
});
