/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { execa } from "execa";
import knex from "knex";
import minimist from "minimist";
import { createSpinner } from "nanospinner";
import fs from "node:fs";
import path from "node:path";
import config from "../knexfile.js";
import updateTypes from "./update-types.js";

/**
 * Resets database to its initial state. Usage:
 *
 *   yarn db:reset [--env #0]
 *   yarn db:reset [--env #0] [--no-seed]
 */

// Parse the command line arguments
const args = minimist(process.argv.slice(2), {
  boolean: ["seed"],
  string: ["from"],
  default: {
    env: "local",
    seed: true,
    restore: false,
  },
});

if (typeof config.connection === "function") {
  await config.connection();
}

let db = knex(config);

const PGHOST = process.env.PGHOST ?? "";
const PGUSER = process.env.PGUSER ?? "";
const PGDATABASE = process.env.PGDATABASE ?? "";
const schema = config.migrations?.schemaName ?? "public";
const role = PGHOST === "localhost" ? "postgres" : "cloudsqlsuperuser";

try {
  // Ensure that the target database exists
  process.env.PGDATABASE = "template1";
  let cmd = db.raw(`CREATE DATABASE ?? WITH OWNER ??`, [PGDATABASE, PGUSER]);
  let spinner = createSpinner(cmd.toSQL().sql).start();
  await cmd
    .then(() => spinner.success())
    .catch((err) => {
      if (err.code === "42P04") {
        spinner.stop();
      } else {
        console.error(err);
        spinner.error({ text: `${cmd.toSQL().sql}: ${err.message}` });
      }
    })
    .finally(() => db.destroy());

  process.env.PGDATABASE = PGDATABASE;
  db = knex(config);

  // Drop open database connections
  await db.raw(
    ` SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = ?
      AND pid <> pg_backend_pid()`,
    [PGDATABASE],
  );

  cmd = db.raw(`DROP SCHEMA ?? CASCADE`, [schema]);
  spinner = createSpinner(cmd.toSQL().sql).start();
  await cmd.then(() => spinner.success());

  cmd = db.raw(`CREATE SCHEMA ?? AUTHORIZATION ??`, [schema, role]);
  spinner = createSpinner(cmd.toSQL().sql).start();
  await cmd.then(() => spinner.success());

  cmd = db.raw(`GRANT ALL ON SCHEMA ?? TO ??`, [schema, PGUSER]);
  spinner = createSpinner(cmd.toSQL().sql).start();
  await cmd.then(() => spinner.success());

  cmd = db.raw(`GRANT ALL ON SCHEMA ?? TO ??`, [schema, "public"]);
  spinner = createSpinner(cmd.toSQL().sql).start();
  await cmd.then(() => spinner.success());

  spinner = createSpinner("Migrate database schema");
  let res = await db.migrate.latest();
  spinner.success({ text: `Migrate database schema (${res[1].length})` });

  if (args.restore) {
    spinner = createSpinner("Restore backup");
    // Find the latest backup file for the selected environment
    const fromEnv = typeof args.restore === "string" ? args.restore : args.env;
    const file = fs
      .readdirSync(path.resolve(__dirname, "../backups"))
      .sort()
      .reverse()
      .find((x) => x.endsWith(`_${fromEnv}.sql`));

    if (!file) {
      throw new Error(
        `Cannot find a SQL backup file of the "${fromEnv}" environment.`,
      );
    }

    await execa(
      "psql",
      [
        "--file",
        path.resolve(__dirname, `../backups/${file}`),
        "--echo-errors",
        "--no-readline",
      ],
      { stdio: "inherit" },
    );

    spinner.success();
  }

  if (args.seed) {
    spinner = createSpinner("Import reference (seed) data");
    res = await db.seed.run();
    spinner.success({
      text: `Import reference (seed) data (${res[0].length})`,
    });
  }

  if (args.env === "local") {
    spinner = createSpinner("Update TypeScript definitions").start();
    await updateTypes().then(() => spinner.success());
  }
} finally {
  db.destroy();
}
