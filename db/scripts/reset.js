/**
 * Resets database to its initial state (for local development). Usage:
 *
 *   yarn db:reset [--env=#0]
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const knex = require("knex");
const cp = require("child_process");
const config = require("../knexfile");

const db = knex({
  ...config,
  connection: { ...config.connection, database: "postgres" },
});

Promise.resolve()
  // Drop and re-create the database
  .then(() => db.raw(`DROP DATABASE IF EXISTS "${process.env.PGDATABASE}"`))
  .then(() => db.raw(`CREATE DATABASE "${process.env.PGDATABASE}"`))
  .finally(() => db.destroy())

  // Migrate database to the latest version
  .then(() => {
    cp.spawnSync("yarn", ["knex", "migrate:latest"], { stdio: "inherit" });
    cp.spawnSync("yarn", ["knex", "seed:run"], { stdio: "inherit" });
    cp.spawnSync("yarn", ["api:update-types"], { stdio: "inherit" });
  });
