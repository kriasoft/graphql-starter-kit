/**
 * Resets database to its initial state (for local development). Usage:
 *
 *   yarn db:reset [--env=#0]
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const knex = require("knex");
const spawn = require("cross-spawn");

const config = require("../knexfile");
const updateTypes = require("./update-types");

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
  await db.destroy();

  // Migrate database to the latest version
  spawn.sync("yarn", ["knex", "migrate:latest"], { stdio: "inherit" });
  spawn.sync("yarn", ["knex", "seed:run"], { stdio: "inherit" });
  await updateTypes();
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
