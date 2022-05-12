/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { greenBright } from "chalk";
import spawn from "cross-spawn";
import envars from "envars";
import minimist from "minimist";
import fs from "node:fs";
import { EOL } from "node:os";
import path from "node:path";
import readline from "node:readline";
import { type Readable } from "node:stream";

// Parse CLI arguments
const args: string[] = [];
const { env } = minimist(process.argv.slice(2), {
  string: ["env"],
  unknown: (arg) => !args.push(arg),
});

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env });

const { APP_ENV, PGDATABASE } = process.env;
const backupDir = path.join(__dirname, "../backups");

if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

console.log(
  `Creating a backup of the %s (${APP_ENV}) database...`,
  greenBright(PGDATABASE),
);

// Get the list of database tables
const tablesCmd = spawn.sync(
  "psql",
  [
    "--no-align",
    "--tuples-only",
    "--record-separator=|",
    "--command",
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
  ],
  { stdio: ["inherit", "pipe", "inherit"] },
);

if (tablesCmd.status && tablesCmd.status !== 0) {
  console.error("Failed to read the list of database tables.");
  process.exit(tablesCmd.status);
}

const tables = tablesCmd.stdout
  .toString("utf8")
  .trim()
  .split("|")
  .filter((x) => x !== "migration" && x !== "migration_lock")
  .map((x) => `public."${x}"`)
  .join(", ");

/*
 * Creates database backup (data only). Usage:
 *
 *   yarn db:backup [--env #0]
 */
const cmd = spawn(
  "pg_dump",
  [
    "--verbose",
    "--data-only",
    "--schema=public",
    "--no-owner",
    "--no-privileges",
    // '--column-inserts',
    "--disable-triggers",
    "--exclude-table=migration",
    "--exclude-table=migration_lock",
    "--exclude-table=migration_id_seq",
    "--exclude-table=migration_lock_index_seq",
    ...args,
  ],
  { stdio: ["pipe", "pipe", "inherit"] },
).on("exit", (code) => {
  if (code && code !== 0) process.exit(code);
});

const timestamp = new Date().toISOString().replace(/(-|:|\.\d{3})/g, "");
const file = path.join(backupDir, `${timestamp}_${APP_ENV}.sql`);
const out = fs.createWriteStream(file, { encoding: "utf8" });
const rl = readline.createInterface({
  input: cmd.stdout as Readable,
  terminal: false,
});

rl.on("line", (line) => {
  // Some (system) triggers cannot be disabled in a cloud environment
  // "DISABLE TRIGGER ALL" => "DISABLE TRIGGER USER"
  if (line.endsWith(" TRIGGER ALL;")) {
    out.write(`${line.substring(0, line.length - 5)} USER;${EOL}`, "utf8");
  }
  // Add a command that truncates all the database tables
  else if (line.startsWith("SET row_security")) {
    out.write(`${line}${EOL}${EOL}TRUNCATE TABLE ${tables} CASCADE;${EOL}`);
  } else {
    out.write(`${line}${EOL}`, "utf8");
  }
});
