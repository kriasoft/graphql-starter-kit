/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { template } from "lodash-es";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseToml } from "toml";
import { $, fs, YAML } from "zx";

export const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
export const envDir = resolve(rootDir, "env");

/**
 * Normalizes and saves the environment variables to a YAML file (for deployment).
 *
 * @param {Record<string, string | number} env - The environment variables
 * @param {string} dest - The target YAML filename
 */
export async function saveEnvVars(env, dest, functionName) {
  if (env.PGHOST) {
    const time = new Date().toISOString();
    env.PGHOST = `/cloudsql/${process.env.GOOGLE_CLOUD_SQL_INSTANCE}`;
    delete env.PGPORT;
    delete env.PGSSLMODE;
    delete env.PGSSLCERT;
    delete env.PGSSLKEY;
    delete env.PGSSLROOTCERT;
    delete env.PGSERVERNAME;
    env.PGAPPNAME = `${functionName} ${process.env.APP_ENV} ${time}`;
  }

  env.NODE_OPTIONS =
    "--require=./.pnp.cjs --require=source-map-support/register --no-warnings";

  Object.keys(env).forEach((key) => {
    if (typeof env[key] === "number") env[key] = String(env[key]);
    if (typeof env[key] !== "string") env[key] = JSON.stringify(env[key]);
  });

  await fs.writeFile(dest, YAML.stringify(env));
}

/**
 * Fetches the URL of the Google Cloud Function (GCF).
 *
 * @param {string} name - The name of the Cloud Function
 */
export function getApiOrigin(name) {
  return $`gcloud beta functions describe ${name} --gen2 ${[
    ...["--project", process.env.GOOGLE_CLOUD_PROJECT],
    ...["--region", process.env.GOOGLE_CLOUD_REGION],
    ...["--format", "value(serviceConfig.uri)"],
  ]}`
    .then((cmd) => cmd.stdout.toString().trim())
    .catch(() => Promise.resolve(process.env.API_ORIGIN /* fallback */));
}

/**
 * Get the arguments passed to the script.
 *
 * @returns {[args: string[], envName: string | undefined]}
 */
export function getArgs() {
  const args = process.argv.slice(2);
  /** @type {String} */
  let envName;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--env") {
      envName = args[i + 1];
      args.splice(i, 2);
      break;
    }

    if (args[i]?.startsWith("--env=")) {
      envName = args[i].slice(6);
      args.splice(i, 1);
      break;
    }
  }

  return [args, envName];
}

/**
 * Load environment variables used in the Cloudflare Worker.
 */
export function getCloudflareBindings(file = "wrangler.toml", envName) {
  const env = envars.config({ cwd: envDir, env: envName });
  let config = parseToml(readFileSync(file, "utf-8"));

  return {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    GOOGLE_CLOUD_CREDENTIALS: process.env.GOOGLE_CLOUD_CREDENTIALS,
    ...JSON.parse(JSON.stringify(config.vars), (key, value) => {
      return typeof value === "string"
        ? value.replace(/\$\{?([\w]+)\}?/g, (_, key) => env[key])
        : value;
    }),
  };
}

export async function readWranglerConfig(file, envName = "test") {
  // Load environment variables from `env/*.env` file(s)
  envars.config({ cwd: resolve(rootDir, "env"), env: envName });

  // Load Wrangler CLI configuration file
  let config = parseToml(await fs.readFile(file, "utf-8"));

  // Interpolate environment variables
  return JSON.parse(JSON.stringify(config), (key, value) => {
    return typeof value === "string"
      ? template(value, {
          interpolate: /\$\{?([\w]+)\}?/,
        })($.env)
      : value;
  });
}
