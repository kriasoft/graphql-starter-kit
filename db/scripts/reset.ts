/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import spawn from "cross-spawn";
import envars from "envars";
import knex, { type Knex } from "knex";
import minimist from "minimist";
import fs from "node:fs";
import path from "node:path";
import ora from "ora";
import config from "../knexfile";
import updateTypes from "./update-types";

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

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env: args.env });

let db: Knex;
const PGHOST: string = process.env.PGHOST as string;
const PGUSER: string = process.env.PGUSER as string;
const PGDATABASE: string = process.env.PGDATABASE as string;
const schema = config.migrations?.schemaName ?? "public";
const role = PGHOST === "localhost" ? "postgres" : "cloudsqlsuperuser";

/**
 * Resets database to its initial state. Usage:
 *
 *   yarn db:reset [--env #0]
 *   yarn db:reset [--env #0] [--no-seed]
 */
async function reset() {
  // Ensure that the target database exists
  process.env.PGDATABASE = "template1";
  db = knex(config);
  let cmd = db.raw(`CREATE DATABASE ?? WITH OWNER ??`, [PGDATABASE, PGUSER]);
  let spinner = ora(cmd.toSQL().sql).start();
  await cmd
    .catch((err) =>
      err.code === "42P04" ? Promise.resolve() : Promise.reject(err),
    )
    .finally(() => db.destroy())
    .then(() => spinner.succeed());

  process.env.PGDATABASE = PGDATABASE;
  db = knex(config);

  // Drop open database connections
  await db.raw(
    ` SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = ?
      AND pid <> pg_backend_pid()`,
    [PGDATABASE as string],
  );

  cmd = db.raw(`DROP SCHEMA ?? CASCADE`, [schema]);
  spinner = ora(cmd.toSQL().sql).start();
  await cmd.then(() => spinner.succeed());

  cmd = db.raw(`CREATE SCHEMA ?? AUTHORIZATION ??`, [schema, role]);
  spinner = ora(cmd.toSQL().sql).start();
  await cmd.then(() => spinner.succeed());

  cmd = db.raw(`GRANT ALL ON SCHEMA ?? TO ??`, [schema, PGUSER]);
  spinner = ora(cmd.toSQL().sql).start();
  await cmd.then(() => spinner.succeed());

  cmd = db.raw(`GRANT ALL ON SCHEMA ?? TO ??`, [schema, "public"]);
  spinner = ora(cmd.toSQL().sql).start();
  await cmd.then(() => spinner.succeed());

  spinner = ora("Migrate database schema");
  let res = await db.migrate.latest();
  spinner.succeed(`${spinner.text} (${res[1].length})`);

  if (args.restore) {
    spinner = ora("Restore backup");
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

    await new Promise<void>((resolve, reject) => {
      spawn(
        "psql",
        [
          "--file",
          path.resolve(__dirname, `../backups/${file}`),
          "--echo-errors",
          "--no-readline",
        ],
        { stdio: "inherit" },
      ).on("exit", (code) => (code === 0 ? resolve() : reject()));
    });

    spinner.succeed();
  }

  if (args.seed) {
    spinner = ora("Import reference (seed) data");
    res = await db.seed.run();
    spinner.succeed(`${spinner.text} (${res[0].length})`);
  }

  if (args.env === "local") {
    spinner = ora("Update TypeScript definitions").start();
    await updateTypes().then(() => spinner.succeed());
  }
}

reset()
  .finally(() => db?.destroy())
  .catch((err) => {
    if (err) console.error(err);
    process.exitCode = 1;
  });
