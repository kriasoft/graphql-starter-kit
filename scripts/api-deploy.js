/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import minimist from "minimist";
import { $ } from "zx";

// Load environment variables (PGHOST, PGUSER, etc.)
const args = minimist(process.argv.slice(2));
process.env.NODE_ENV = "production";
process.env.APP_ENV = args.env ?? process.env.APP_ENV ?? "test";
envars.config({ env: process.env.APP_ENV });
delete process.env.PGSSLMODE;

// Load the list of environment variables required by the app (api/env.ts)
/** @type {import("../api/env").default} */
const env = await import("../api/dist/index.js").then((x) => ({ ...x.env }));

// Use Cloud SQL Proxy in Google Cloud Functions (GCF) environment
const region = process.env.GOOGLE_CLOUD_REGION;
env.PGHOST = `/cloudsql/${env.PGSERVERNAME.replace(":", `:${region}:`)}`;
env.PGAPPNAME = `api ${env.APP_ENV} ${new Date().toISOString()}`;
delete env.PGSSLMODE;
delete env.PGSSLCERT;
delete env.PGSSLKEY;
delete env.PGSSLROOTCERT;
delete env.PGSERVERNAME;

const name = args.version ? `api-${args.version}` : `api`;

/**
 * Deploys the "api" package to Google Cloud Functions (GCF). Usage:
 *
 *   $ yarn api:deploy [--env #0]
 *
 * @see https://cloud.google.com/functions
 * @see https://cloud.google.com/sdk/gcloud/reference/functions/deploy
 */
await $`gcloud beta functions deploy ${name} ${[
  `--project=${process.env.GOOGLE_CLOUD_PROJECT}`,
  `--region=${region}`,
  `--allow-unauthenticated`,
  `--entry-point=api`,
  `--gen2`,
  `--memory=1G`,
  `--runtime=nodejs16`,
  `--signature-type=http`,
  `--source=./dist`,
  `--timeout=30s`,
  `--set-env-vars=NODE_OPTIONS=--require=./.pnp.cjs --require=source-map-support/register --no-warnings`,
  ...Object.keys(env).map((key) => `--set-env-vars=${key}=${env[key]}`),
  `--min-instances=0`,
  `--max-instances=4`,
  `--trigger-http`,
]}`;
