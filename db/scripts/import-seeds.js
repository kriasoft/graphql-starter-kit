/**
 * Imports reference (seed) data from the database.
 *
 *   yarn db:import-seeds [--env #0]
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

require("env");
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const db = require("knex")(require("../knexfile"));

function saveSync(filename, data) {
  fs.writeFileSync(
    path.resolve(__dirname, filename),
    prettier.format(JSON.stringify(data), { parser: "json" }),
    "utf-8",
  );
}

async function importData() {
  const users = await db.table("user").orderBy("created_at").select();
  saveSync("../seeds/01_users.json", users);

  const identities = await db.table("identity").orderBy("created_at").select();
  saveSync("../seeds/02_identities.json", identities);
}

importData()
  .finally(() => db.destroy())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
