/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Knex } from "knex";
import fs from "node:fs/promises";

/**
 * Configuration settings for Knex database client.
 * @see https://knexjs.org/#Installation-client
 */
export default {
  client: "pg",

  async connection() {
    const config: Knex.PgConnectionConfig = {};

    // Use SSL/TLS when connecting to Cloud SQL database
    // from a local development machine (see `env/.local.env`).
    if (process.env.PGSSLMODE === "verify-ca") {
      const [cert, key, ca] = await Promise.all(
        [
          process.env.PGSSLCERT,
          process.env.PGSSLKEY,
          process.env.PGSSLROOTCERT,
        ].map((file) => fs.readFile(file as string, "ascii")),
      );
      config.ssl = { cert, key, ca, servername: process.env.PGSERVERNAME };
    }

    return config;
  },

  // Cloud Functions limits concurrent executions to 1 per instance. You never
  // have a situation where a single function instance is processing two
  // requests at the same time. In most situations, only a single database
  // connection is needed.
  pool: {
    min: 0,
    max: 1,
  },

  migrations: {
    schemaName: "public",
    tableName: "migration",
  },

  debug: process.env.PGDEBUG === "true",
} as Knex.Config;
