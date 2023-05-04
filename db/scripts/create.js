/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import chalk from "chalk";
import envars from "envars";
import knex from "knex";
import { createSpinner } from "nanospinner";
import { basename } from "node:path";
import config from "../knexfile.js";
import { getArgs } from "./utils.js";

/**
 * Bootstraps a new PostgreSQL database if it doesn't exist.
 *
 *   $ yarn db:create [--env #0]
 * @param {{ silent?: boolean}} options
 */
export async function createDatabase(options = {}) {
  const PGUSER = process.env.PGUSER ?? "";
  const PGDATABASE = process.env.PGDATABASE ?? "";

  const spinner = createSpinner(
    `Create database: ${chalk.greenBright(PGDATABASE)}`,
  );

  if (options.silent !== true) spinner.start();

  let db = knex(config);
  const schema = config.searchPath || "public";

  try {
    await db.select(db.raw("current_database()"));
    if (options.silent !== true) spinner.stop();
  } catch (err) {
    if (err.code !== "3D000" /* database does not exist */) throw err;

    await db.destroy();

    process.env.PGDATABASE = "template1";
    db = knex(config);

    // Attempt to create a new database
    await db.raw(`CREATE DATABASE ?? WITH OWNER ??`, [PGDATABASE, PGUSER]);

    // Attempt to create a new database schema
    await db.raw(`CREATE SCHEMA IF NOT EXISTS ?? AUTHORIZATION ??`, [
      schema,
      PGUSER,
    ]);

    if (options.silent !== true) spinner.success();
  } finally {
    process.env.PGDATABASE = PGDATABASE;
    await db.destroy();
  }
}

if (basename(__filename) === "create.js") {
  // Load environment variables (PGHOST, PGUSER, etc.)
  const [envName] = getArgs();
  envars.config({ env: envName });

  createDatabase().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
