/**
 * REPL shell for Knex.js. Usage:
 *
 *   yarn db:repl [--env=#0]
 *
 * @see https://knexjs.org/#Builder
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const repl = require("repl");
const knex = require("knex");
const nanoid = require("nanoid");
const config = require("../knexfile");

// Short ID generator
// https://zelark.github.io/nano-id-cc/
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
global.newUserId = nanoid.customAlphabet(alphabet, 6);

let db = knex({
  ...config,
  connection: { ...config.connection, database: "postgres" },
});

Promise.resolve()
  // Creates a new database if it doesn't exist
  .then(() => db.raw("CREATE DATABASE ??", [process.env.PGDATABASE]))
  .catch(() => Promise.resolve())
  .then(() => db.destroy())
  .then(() => (global.db = db = knex(config)))

  // Starts a REPL shell
  .then(() => db.raw(`SELECT version(), current_database() as database`))
  .then(({ rows: [x] }) => {
    console.log(x.version);
    console.log(`Connected to "${x.database}". Usage example:`);
    console.log(``);
    console.log(`   await db.table("users").first()`);
    console.log(`   await db.raw("select version()")`);
    console.log(``);
    console.log(`Type ".exit" to exit the REPL`);
    repl.start(`#> `).on("exit", () => db.destroy());
  });
