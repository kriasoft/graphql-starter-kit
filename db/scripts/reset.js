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

const db = knex({
  ...config,
  connection: { ...config.connection, database: "postgres" },
});

Promise.resolve()
  // Drop existing connections
  .then(() =>
    db.raw(
      `
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = ? AND pid <> pg_backend_pid()`,
      [process.env.PGDATABASE],
    ),
  )

  // Drop and re-create the database
  .then(() => db.raw(`DROP DATABASE IF EXISTS ??`, [process.env.PGDATABASE]))
  .then(() => db.raw(`CREATE DATABASE ??`, [process.env.PGDATABASE]))
  .finally(() => db.destroy())

  // Migrate database to the latest version
  .then(() => {
    spawn.sync("yarn", ["knex", "migrate:latest"], { stdio: "inherit" });
    spawn.sync("yarn", ["knex", "seed:run"], { stdio: "inherit" });
    spawn.sync("yarn", ["api:update-types"], { stdio: "inherit" });
  });
