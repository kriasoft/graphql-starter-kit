/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { config } from "envars";
import { type Knex } from "knex";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));

// Load environment variables (PGHOST, PGUSER, etc.)
config({ env: args.env });

/**
 * Knex.js CLI configuration
 * @see https://knexjs.org/#knexfile
 */
export default {
  client: "pg",

  connection() {
    return import("../api/db/config.cjs").then((x) => x.default.connection);
  },

  migrations: {
    schemaName: "public",
    tableName: "migration",
  },

  debug: process.env.PGDEBUG === "true",
} as Knex.Config;
