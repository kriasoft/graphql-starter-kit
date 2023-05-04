/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import knex from "knex";
import { format } from "prettier";
import { fs, path } from "zx";
import config from "../knexfile.js";

/**
 * Imports reference (seed) data from the database.
 *
 *   yarn db:import-seeds [--env #0]
 */

const db = knex(config);

async function saveSync(filename, data) {
  await fs.writeFile(
    path.resolve(__dirname, filename),
    format(JSON.stringify(data), { parser: "json" }),
  );
}

try {
  const users = await db.table("user").orderBy("created").select();
  saveSync("../seeds/01_users.json", users);

  const identities = await db.table("identity").orderBy("created").select();
  saveSync("../seeds/02_identities.json", identities);
} finally {
  db.destroy();
}
