/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { greenBright } from "chalk";
import envars from "envars";
import knex from "knex";
import minimist from "minimist";
import { basename } from "node:path";
import config from "../../api/core/dbConfig";

/**
 * Bootstraps a new PostgreSQL database if it doesn't exist.
 *
 *   $ yarn db:create [--env #0]
 */
export default async function createDatabase() {
  const PGUSER = process.env.PGUSER as string;
  const PGDATABASE = process.env.PGDATABASE as string;
  const schema: string = (config.searchPath as string) || "public";

  let db = knex(config);

  try {
    await db.select(db.raw("current_database()"));
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
  } finally {
    process.env.PGDATABASE = PGDATABASE;
    await db.destroy();
  }
}

if (basename(process.argv[1]) === "create.ts") {
  // Load environment variables (PGHOST, PGUSER, etc.)
  envars.config({ env: minimist(process.argv.slice(2)).env });

  createDatabase().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
