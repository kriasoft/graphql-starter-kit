/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import chalk from "chalk";
import envars from "envars";
import knex from "knex";
import repl from "node:repl";
import config from "../knexfile.js";
import { createDatabase } from "./create.js";
import { getArgs } from "./utils.js";

/**
 * Starts a REPL shell that can be used for working with Knex.js from
 * the terminal window. For example:
 *
 *   $ yarn repl
 *   > await db.table("user").first();
 *
 * https://knexjs.org/
 */

// Load environment variables (PGHOST, PGUSER, etc.)
const [envName] = getArgs();
envars.config({ env: envName });

// Ensure that the target database exists before proceeding
await createDatabase({ silent: true });

// Initialize Knex database client
const db = knex(config);
// eslint-disable-next-line no-undef
Object.defineProperty(globalThis, "db", { value: db });

// Fetch the current database version
const [x] = await db.select(
  db.raw("version(), current_database() as database"),
);

console.log(`Connected to ${chalk.greenBright(x.database)}. Usage example:`);
console.log(``);
console.log(`   await db.table("user").first()`);
console.log(`   await db.select(db.raw("version()"))`);
console.log(`   await db.fn.newUserId()`);
console.log(``);
console.log(`Type ${chalk.greenBright(".exit")} to exit the REPL shell`);
repl.start(chalk.blueBright(`#> `)).on("exit", () => db?.destroy());
