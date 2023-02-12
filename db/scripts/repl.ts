/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { blueBright, greenBright } from "chalk";
import envars from "envars";
import { knex } from "knex";
import repl from "node:repl";
import { load } from "ts-import";
import { createDatabase } from "./create";
import { getArgs } from "./utils";

/**
 * Starts a REPL shell that can be used for working with Knex.js from
 * the terminal window. For example:
 *
 *   $ yarn repl
 *   > await db.table("user").first();
 *
 * https://knexjs.org/
 */
(async function () {
  // Load environment variables (PGHOST, PGUSER, etc.)
  const [envName] = getArgs();
  envars.config({ env: envName });

  // Ensure that the target database exists before proceeding
  await createDatabase({ silent: true });

  // Initialize Knex database client
  const { default: config } = await load("../api/core/db-config.ts");
  const db = knex(config);
  Object.defineProperty(globalThis, "db", { value: db });

  // Fetch the current database version
  const [x] = await db.select<[{ version: string; database: string }]>(
    db.raw("version(), current_database() as database"),
  );

  console.log(`Connected to ${greenBright(x.database)}. Usage example:`);
  console.log(``);
  console.log(`   await db.table("user").first()`);
  console.log(`   await db.select(db.raw("version()"))`);
  console.log(`   await db.fn.newUserId()`);
  console.log(``);
  console.log(`Type ${greenBright(".exit")} to exit the REPL shell`);
  repl.start(blueBright(`#> `)).on("exit", () => db?.destroy());
})();
