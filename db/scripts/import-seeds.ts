/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import knex from "knex";
import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import config from "../knexfile";

const db = knex(config);

async function saveSync(filename: string, data: unknown) {
  await fs.writeFile(
    path.resolve(__dirname, filename),
    prettier.format(JSON.stringify(data), { parser: "json" }),
  );
}

/**
 * Imports reference (seed) data from the database.
 *
 *   yarn db:import-seeds [--env #0]
 */
async function importData() {
  const users = await db.table("user").orderBy("created").select();
  saveSync("../seeds/01_users.json", users);

  const identities = await db.table("identity").orderBy("created").select();
  saveSync("../seeds/02_identities.json", identities);
}

importData()
  .finally(() => db.destroy())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
