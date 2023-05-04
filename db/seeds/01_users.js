/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { fs } from "zx";

/**
 *
 * @param {import("knex").Knex} db
 */
export async function seed(db) {
  const json = await fs.readFile("./seeds/01_users.json");
  const records = JSON.parse(json);

  await db.table("user").insert(records).onConflict(["id"]).merge();
}
