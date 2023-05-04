/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { readFile } from "node:fs/promises";
import { argv } from "zx";

/**
 * Knex.js configuration
 *
 * @see https://knexjs.org/guide/#configuration-options
 * @type {import("knex").Knex.Config}
 */
export default {
  client: "pg",

  async connection() {
    // Load environment variables (PGHOST, PGUSER, etc.)
    envars.config({ env: argv.env ?? "local" });

    /** @type {import("knex").Knex.PgConnectionConfig} */
    const config = {};

    // Use SSL/TLS when connecting to Cloud SQL database
    // from a local development machine (see `env/.local.env`).
    if (process.env.PGSSLMODE === "verify-ca") {
      const [cert, key, ca] = await Promise.all(
        [
          process.env.PGSSLCERT,
          process.env.PGSSLKEY,
          process.env.PGSSLROOTCERT,
        ].map((file) => readFile(file, "ascii")),
      );
      config.ssl = { cert, key, ca, servername: process.env.PGSERVERNAME };
    }

    return config;
  },

  pool: {
    min: 0,
    max: 2,
  },

  migrations: {
    schemaName: "public",
    tableName: "migration",
  },

  debug: process.env.PGDEBUG === "true",
};
