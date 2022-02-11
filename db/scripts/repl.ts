/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

// @ts-expect-error @babel/register doesn't have types
import registerBabel from "@babel/register";
import { blueBright, greenBright } from "chalk";
import { type Knex } from "knex";
import repl from "node:repl";
import createDatabase from "./create";

registerBabel({
  only: [".", "../api"],
  extensions: [".ts", ".js"],
  rootMode: "upward",
  cache: false,
});

// Load environment variables (PGHOST, PGUSER, etc.)
require("../knexfile");

/**
 * Starts a REPL shell that can be used for working with Knex.js from
 * the terminal window. For example:
 *
 *   $ yarn repl
 *   > await db.table("user").first();
 *
 * @see https://knexjs.org/
 */
Promise.resolve()
  .then(() => createDatabase())
  .then(async function () {
    const db = await import("../../api/db").then((x) => x.default);
    Object.defineProperty(globalThis, "db", { value: db });
    return db.select(db.raw("version(), current_database() as database"));
  })
  .then(([x]) => {
    console.log(x.version);
    console.log(`Connected to ${greenBright(x.database)}. Usage example:`);
    console.log(``);
    console.log(`   await db.table("user").first()`);
    console.log(`   await db.select(db.raw("version()"))`);
    console.log(`   await db.fn.newUserId()`);
    console.log(``);
    console.log(`Type ${greenBright(".exit")} to exit the REPL shell`);
    repl.start(blueBright(`#> `)).on("exit", () => db?.destroy());
  });

declare let db: Knex;
