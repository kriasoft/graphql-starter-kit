/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * CLI client for PostgreSQL. Usage example:
 *
 *   $ yarn psql --env=prod
 *   # \dt
 *
 * @see https://www.postgresql.org/docs/current/app-psql.html
 */

const spawn = require("cross-spawn");
const envars = require("envars");
const minimist = require("minimist");
const createDatabase = require("./create");

// Parse CLI arguments
const args = [];
const { env } = minimist(process.argv.slice(2), {
  string: ["env"],
  unknown: (arg) => !args.push(arg),
});

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env });

// Ensure that the target database exists
createDatabase().then(() => {
  // Launch interactive terminal for working with PostgreSQL
  spawn("psql", args, { stdio: "inherit" });
});
