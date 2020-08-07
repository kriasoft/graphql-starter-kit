/**
 * Restores database from a backup. Usage:
 *
 *   yarn db:restore [--env=#0]
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const fs = require("fs");
const path = require("path");
const spawn = require("cross-spawn");

// Load environment variables (PGHOST, PGUSER, etc.)
require("env");

// Find the latest backup file for the selected environment
const { ENV, PGDATABASE } = process.env;
const file = fs
  .readdirSync(path.resolve(__dirname, "../backups"))
  .sort()
  .reverse()
  .find((x) => x.endsWith(`_${ENV}.sql`));

if (!file) {
  console.log(`Cannot find the SQL backup file for "${ENV}" environment.`);
  process.exit(1);
}

console.log(`Restoring ${file} to ${PGDATABASE} (${ENV})...`);

spawn(
  "psql",
  [
    "--file",
    path.resolve(__dirname, `../backups/${file}`),
    "--echo-errors",
    "--no-readline",
    ...process.argv.slice(2).filter((x) => !x.startsWith("--env")),
  ],
  {
    stdio: "inherit",
  },
).on("exit", process.exit);
