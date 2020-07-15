/**
 * REPL shell for PostgreSQL. Usage:
 *
 *   yarn psql [--env=#0]
 *
 * @see https://www.postgresql.org/docs/current/app-psql.html
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const cp = require("child_process");
const { _ } = require("minimist")(process.argv.slice(2));

// Load environment variables (PGHOST, PGUSER, etc.)
require("env");

// Create a new database if it doesn't exist
const cmd = `CREATE DATABASE "${process.env.PGDATABASE}"`;
cp.spawnSync("psql", ["-d", "postgres", "-c", cmd], {
  stdio: "ignore",
});

// Launch interactive terminal for working with PostgreSQL
cp.spawn("psql", _, { stdio: "inherit" });
