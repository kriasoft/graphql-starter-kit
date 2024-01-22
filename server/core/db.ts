/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import knex, { Knex } from "knex";
import { env } from "./env";

/**
 * Knex.js database client and query builder for PostgreSQL.
 *
 * @see https://knexjs.org/
 */
export const db = knex({
  client: "pg",
  connection: {
    // Uses Cloud SQL Connector in development mode.
    ...("dbOptions" in globalThis
      ? (globalThis as unknown as { dbOptions: DbOptions }).dbOptions
      : { host: env.PGHOST, port: env.PGPORT }),
    user: env.PGUSER,
    password: env.PGPASSWORD,
    database: env.PGDATABASE,
  },
});

type DbOptions = Knex.ConnectionConfigProvider;
