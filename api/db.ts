/**
 * Knex.js database client and query builder for PostgreSQL.
 *
 * @see https://knexjs.org/
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import fs from "fs";
import knex from "knex";
import env from "./env";

export default knex({
  client: "pg",

  connection: {
    ssl: env.PGSSLMODE === "verify-ca" && {
      cert: fs.readFileSync(env.PGSSLCERT, "ascii"),
      key: fs.readFileSync(env.PGSSLKEY, "ascii"),
      ca: fs.readFileSync(env.PGSSLROOTCERT, "ascii"),
      servername: env.PGSERVERNAME,
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

  debug: env.PGDEBUG,
});
