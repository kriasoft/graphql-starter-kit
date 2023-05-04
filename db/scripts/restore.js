/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

/**
 * Restores database from a backup file. Usage:
 *
 *   $ yarn db:restore [--env #0] [--from #0]
 */

import chalk from "chalk";
import envars from "envars";
import { execa } from "execa";
import minimist from "minimist";
import fs from "node:fs";
import path from "node:path";
import { getArgs } from "./utils.js";

// Parse CLI arguments
const [envName, args] = getArgs();
const { from } = minimist(args.splice(0), {
  string: ["from"],
  unknown: (arg) => !args.push(arg),
});

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env: envName });

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
  `Restoring ${chalk.greenBright(file)} to ${chalk.greenBright(
    PGDATABASE,
  )} (${APP_ENV})...`,
);

await execa(
  "psql",
  [
    "--file",
    path.resolve(__dirname, `../backups/${file}`),
    "--echo-errors",
    "--no-readline",
    ...args,
  ],
  { stdio: "inherit" },
);
