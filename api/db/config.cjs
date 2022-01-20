/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

const fs = require("fs");

/**
 * Configuration settings for Knex database client.
 *
 * NOTE: Using vanilla JavaScript here for better performance
 *       when used with automation scripts (yarn db:migrate etc.).
 *
 * @type {import("knex").Knex.Config}
 */
module.exports = {
  client: "pg",

  connection: {
    ssl: process.env.PGSSLMODE === "verify-ca" && {
      cert: fs.readFileSync(process.env.PGSSLCERT, "ascii"),
      key: fs.readFileSync(process.env.PGSSLKEY, "ascii"),
      ca: fs.readFileSync(process.env.PGSSLROOTCERT, "ascii"),
      servername: process.env.PGSERVERNAME,
    },
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

  debug: process.env.PGDEBUG,
};
