/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import chalk from "chalk";
import envars from "envars";
import { execa, execaSync } from "execa";
import { EOL } from "node:os";
import readline from "node:readline";
import { fs, path } from "zx";
import { getArgs } from "./utils.js";

// Parse CLI arguments
const [envName, args] = getArgs();

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env: envName });

const { APP_ENV, PGDATABASE } = process.env;
const backupDir = path.join(__dirname, "../backups");

if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

console.log(
  `Creating a backup of the %s (${APP_ENV}) database...`,
  chalk.greenBright(PGDATABASE),
);

// Get the list of database tables
const tablesCmd = execaSync(
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
const cmd = execa(
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
const rl = readline.createInterface({ input: cmd.stdout, terminal: false });

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
