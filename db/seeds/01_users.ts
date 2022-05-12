/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Knex } from "knex";

export async function seed(db: Knex) {
  const { default: records } = await import("./users.json");

  await db.table("user").insert(records).onConflict(["id"]).merge();
}
