/**
 * Resets database to its initial state. Usage:
 *
 *   yarn db:reset [--env #0] [--from #0]
 *   yarn db:reset [--env #0] [--seed]
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

const knex = require("knex");
const spawn = require("cross-spawn");
const minimist = require("minimist");

const db = knex(require("../knexfile"));
const updateTypes = require("./update-types");

// Parse the command line arguments
const args = minimist(process.argv.slice(2), {
  boolean: ["seed"],
  default: { env: "dev", seed: false },
});

const schema = "public";
const role =
  process.env.PGHOST === "localhost" ? "postgres" : "cloudsqlsuperuser";

async function reset() {
  // Drop and re-create the database schema
  await db.raw(`DROP SCHEMA IF EXISTS ?? CASCADE`, [schema]);
  await db.raw(`CREATE SCHEMA ?? AUTHORIZATION ??`, [schema, role]);
  await db.raw(`GRANT ALL ON SCHEMA public TO ??`, [process.env.PGUSER]);

  let p;
  const opts = { stdio: "inherit" };
  const envArg = `--env=${args.env}`;

  // Migrate database to the latest version
  p = spawn.sync("yarn", ["knex", "migrate:latest", envArg], opts);
  if (p.status !== 0) throw new Error();

  // Restore data from a backup file
  if (args.from) {
    const fromArg = args.from ? `--from=${args.from}` : undefined;
    p = spawn.sync("yarn", ["run", "restore", envArg, fromArg], opts);
    if (p.status !== 0) throw new Error();
  }

  // Seed database with sample/reference data
  if (args.seed) {
    p = spawn.sync("yarn", ["knex", "seed:run", envArg], opts);
    if (p.status !== 0) throw new Error();
  }

  if (args.env === "dev" || args.env === "local") {
    await updateTypes();
  }
}

reset()
  .finally(() => db.destroy())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
