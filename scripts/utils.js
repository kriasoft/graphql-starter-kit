/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { $, fs, YAML } from "zx";

/**
 * Normalizes and saves the environment variables to a YAML file (for deployment).
 *
 * @param {Record<string, string | number} env - The environment variables
 * @param {string} dest - The target YAML filename
 */
export async function saveEnvVars(env, dest) {
  if (env.PGHOST) {
    env.PGHOST = `/cloudsql/${process.env.GOOGLE_CLOUD_SQL_INSTANCE}`;
    delete env.PGPORT;
    delete env.PGSSLMODE;
    delete env.PGSSLCERT;
    delete env.PGSSLKEY;
    delete env.PGSSLROOTCERT;
    delete env.PGSERVERNAME;
  }

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
