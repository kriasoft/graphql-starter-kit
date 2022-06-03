/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { execa as $ } from "execa";
import { argv, chalk, path } from "zx";
import { saveEnvVars } from "./utils.js";

// The name of the Cloud Function
const functionName = argv.version ? `api-${argv.version}` : `api`;

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env: argv.env ?? "test" });

// Load the list of environment variables required by the app (api/env.ts)
process.env.NODE_ENV = "production";
const env = await import("../api/dist/index.js").then((x) => ({ ...x.env }));

// Normalize and save the required environment variables to `dist/env.yml`
env.PGAPPNAME = `${functionName} ${env.APP_ENV} ${new Date().toISOString()}`;
env.NODE_OPTIONS = `--require=./.pnp.cjs --require=source-map-support/register --no-warnings`;
await saveEnvVars(env, path.resolve(__dirname, "../api/dist/env.yml"));

/**
 * Deploys the "api" package to Google Cloud Functions (GCF). Usage:
 *
 *   $ yarn api:deploy [--env #0]
 *
 * @see https://cloud.google.com/functions
 * @see https://cloud.google.com/sdk/gcloud/reference/functions/deploy
 */
await $(
  `gcloud`,
  [
    ...["beta", "functions", "deploy", functionName],
    `--project=${env.GOOGLE_CLOUD_PROJECT}`,
    `--region=${env.GOOGLE_CLOUD_REGION}`,
    `--allow-unauthenticated`,
    `--entry-point=api`,
    `--gen2`,
    `--memory=1G`,
    `--runtime=nodejs16`,
    `--source=.`,
    `--timeout=30s`,
    `--env-vars-file=env.yml`,
    `--min-instances=0`,
    `--max-instances=4`,
    `--trigger-http`,
  ],
  { stdio: "inherit", cwd: path.resolve(__dirname, "../api/dist") },
).catch((err) => {
  process.exitCode = err.exitCode;
  console.error("\n" + chalk.redBright(err.command));
  return Promise.resolve();
});
