/**
 * Knex.js CLI configuration.
 *
 * @see https://knexjs.org/#knexfile
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

// Load environment variables (PGHOST, PGUSER, etc.)
require("env");

/**
 * @type {import("knex").Config}
 */
module.exports = {
  client: "pg",

  connection: {},

  pool: { min: 0, max: 1 },

  migrations: { tableName: "migrations" },
};
