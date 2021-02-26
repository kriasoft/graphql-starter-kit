/**
 * Restores database from a backup file. Usage:
 *
 *   yarn db:restore [--env #0] [--from #0]
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

const fs = require("fs");
const path = require("path");
const spawn = require("cross-spawn");
const minimist = require("minimist");

// Load environment variables (PGHOST, PGUSER, etc.)
require("env");

const args = minimist(process.argv.slice(2));
const toEnv = args.env || "dev";
const fromEnv = args.from || toEnv;

// Find the latest backup file for the selected environment
const { PGDATABASE } = process.env;
const file = fs
  .readdirSync(path.resolve(__dirname, "../backups"))
  .sort()
  .reverse()
  .find((x) => x.endsWith(`_${fromEnv}.sql`));

if (!file) {
  console.log(`Cannot find the SQL backup file for "${fromEnv}" environment.`);
  process.exit(1);
}

console.log(`Restoring ${file} to ${PGDATABASE} (${toEnv})...`);

spawn(
  "psql",
  [
    "--file",
    path.resolve(__dirname, `../backups/${file}`),
    "--echo-errors",
    "--no-readline",
    ...args._,
  ],
  { stdio: "inherit" },
).on("exit", process.exit);
