/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Restores database from a backup file. Usage:
 *
 *   $ yarn db:restore [--env #0] [--from #0]
 */

import { greenBright } from "chalk";
import spawn from "cross-spawn";
import envars from "envars";
import minimist from "minimist";
import fs from "node:fs";
import path from "node:path";

// Parse CLI arguments
const args: string[] = [];
const { env, from } = minimist(process.argv.slice(2), {
  string: ["env", "from"],
  unknown: (arg) => !args.push(arg),
});

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env });

const { APP_ENV, PGDATABASE } = process.env;
const fromEnv = from || APP_ENV;

// Find the latest backup file for the selected environment
const file = fs
  .readdirSync(path.resolve(__dirname, "../backups"))
  .sort()
  .reverse()
  .find((x) => x.endsWith(`_${fromEnv}.sql`));

if (!file) {
  console.log(`Cannot find a SQL backup file of the "${fromEnv}" environment.`);
  process.exit(1);
}

console.log(
  `Restoring ${greenBright(file)} to ${greenBright(
    PGDATABASE,
  )} (${APP_ENV})...`,
);

spawn(
  "psql",
  [
    "--file",
    path.resolve(__dirname, `../backups/${file}`),
    "--echo-errors",
    "--no-readline",
    ...args,
  ],
  { stdio: "inherit" },
).on("exit", process.exit);
