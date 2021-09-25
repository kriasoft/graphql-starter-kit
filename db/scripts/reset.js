/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

const ora = require("ora");
const knex = require("knex");
const envars = require("envars");
const minimist = require("minimist");
const config = require("../knexfile");
const updateTypes = require("./update-types");

// Parse the command line arguments
const args = minimist(process.argv.slice(2), {
  boolean: ["seed"],
  default: { env: "local", seed: true },
});

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env: args.env });

/** @type {import("knex").Knex} */ let db;
const { PGHOST, PGDATABASE, PGUSER } = process.env;
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
  const database = "template1";
  db = knex({ ...config, connection: { ...config.connection, database } });
  let cmd = db.raw(`CREATE DATABASE ?? WITH OWNER ??`, [PGDATABASE, PGUSER]);
  let spinner = ora(cmd.toSQL().sql).start();
  await cmd
    .catch((err) => err.code === "42P04" && Promise.resolve())
    .finally(() => db.destroy())
    .then(() => spinner.succeed());

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
  spinner.succeed(`${spinner.text} to (${res[1].length})`);

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
    console.error(err.stack);
    process.exit(1);
  });
