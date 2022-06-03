/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { fs, YAML } from "zx";

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
