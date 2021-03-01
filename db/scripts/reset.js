/**
 * Resets database to its initial state (for local development). Usage:
 *
 *   yarn db:reset [--env #0] [--no-seed]
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

const knex = require("knex");
const spawn = require("cross-spawn");
const minimist = require("minimist");

const config = require("../knexfile");
const updateTypes = require("./update-types");

const args = minimist(process.argv.slice(2), {
  boolean: ["seed"],
  default: { env: "dev", seed: true },
});

async function reset() {
  const db = knex({
    ...config,
    connection: { ...config.connection, database: "postgres" },
  });

  // Drop existing connections
  await db.raw(
    ` SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = ? AND pid <> pg_backend_pid()`,
    [process.env.PGDATABASE],
  );

  // Drop and re-create the database
  await db.raw(`DROP DATABASE IF EXISTS ??`, [process.env.PGDATABASE]);
  await db.raw(`CREATE DATABASE ??`, [process.env.PGDATABASE]);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await db.destroy();

  // Migrate database to the latest version
  spawn.sync("yarn", ["knex", "migrate:latest"], { stdio: "inherit" });

  if (args.seed) {
    spawn.sync("yarn", ["knex", "seed:run"], { stdio: "inherit" });
  }

  await updateTypes();
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
