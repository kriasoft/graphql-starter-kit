/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

const envars = require("envars");
const args = require("minimist")(process.argv.slice(2));

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env: args.env });

/**
 * Knex.js CLI configuration
 *
 * @see https://knexjs.org/#knexfile
 * @type {import("knex").Knex.Config}
 */
module.exports = {
  ...require("../api/db/config"),
};
