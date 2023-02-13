/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { greenBright } from "chalk";
import envars from "envars";
import { knex } from "knex";
import { createSpinner } from "nanospinner";
import { basename } from "node:path";
import { load } from "ts-import";
import { getArgs } from "./utils";

/**
 * Bootstraps a new PostgreSQL database if it doesn't exist.
 *
 *   $ yarn db:create [--env #0]
 */
export async function createDatabase(options: Options = {}) {
  const PGUSER = process.env.PGUSER as string;
  const PGDATABASE = process.env.PGDATABASE as string;

  const spinner = createSpinner(`Create database: ${PGDATABASE}`);

  if (options.silent !== true) spinner.start();

  const { default: config } = await load("../api/core/db-config.ts");
  const schema: string = (config.searchPath as string) || "public";

  let db = knex(config);

  try {
    await db.select(db.raw("current_database()"));
    if (options.silent !== true) spinner.stop();
  } catch (err) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    if ((err as any).code !== "3D000" /* database does not exist */) throw err;

    console.log(`Creating ${greenBright(PGDATABASE)} database.`);
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

if (basename(process.argv[1]) === "create.ts") {
  // Load environment variables (PGHOST, PGUSER, etc.)
  const [envName] = getArgs();
  envars.config({ env: envName });

  createDatabase().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}

type Options = {
  silent?: true;
};
