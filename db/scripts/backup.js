/**
 * Creates database backup (data only). Usage:
 *
 *   yarn db:backup [--env=#0]
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const spawn = require("cross-spawn");
const cp = require("child_process");
const { EOL } = require("os");

// Load environment variables (PGHOST, PGUSER, etc.)
require("env");

// Get the list of database tables
let cmd = spawn.sync(
  "psql",
  [
    "--no-align",
    "--tuples-only",
    "--record-separator=|",
    "--command",
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
  ],
  {
    stdio: ["inherit", "pipe", "inherit"],
  },
);

if (cmd.status !== 0) {
  console.error("Failed to read the list of database tables.");
  process.exit(cmd.status);
}

const tables = cmd.stdout
  .toString("utf8")
  .trim()
  .split("|")
  .filter((x) => x !== "migrations" && x !== "migrations_lock")
  .map((x) => `public."${x}"`)
  .join(", ");

// Dump the database
cmd = cp
  .spawn(
    "pg_dump",
    [
      "--verbose",
      "--data-only",
      "--no-owner",
      "--no-privileges",
      // '--column-inserts',
      "--disable-triggers",
      "--exclude-table=migrations",
      "--exclude-table=migrations_lock",
      "--exclude-table=migrations_id_seq",
      "--exclude-table=migrations_lock_index_seq",
      ...process.argv.slice(2).filter((x) => !x.startsWith("--env")),
    ],
    {
      stdio: ["pipe", "pipe", "inherit"],
    },
  )
  .on("exit", (code) => {
    if (code !== 0) process.exit(code);
  });

const env = process.env.ENV;
const timestamp = new Date().toISOString().replace(/(-|:|\.\d{3})/g, "");
const file = path.resolve(__dirname, `../backups/${timestamp}_${env}.sql`);
const out = fs.createWriteStream(file, { encoding: "utf8" });
const rl = readline.createInterface({ input: cmd.stdout, terminal: false });

rl.on("line", (line) => {
  // Some (system) triggers cannot be disabled in a cloud environment
  // "DISABLE TRIGGER ALL" => "DISABLE TRIGGER USER"
  if (line.endsWith(" TRIGGER ALL;")) {
    out.write(`${line.substr(0, line.length - 5)} USER;${EOL}`, "utf8");
  }
  // Add a command that truncates all the database tables
  else if (line.startsWith("SET row_security")) {
    out.write(`${line}${EOL}${EOL}TRUNCATE TABLE ${tables} CASCADE;${EOL}`);
  } else {
    out.write(`${line}${EOL}`, "utf8");
  }
});
