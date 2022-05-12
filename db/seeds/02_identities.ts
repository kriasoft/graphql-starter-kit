/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Knex } from "knex";

export async function seed(db: Knex) {
  const { default: records } = await import("./identities.json");

  if (records.length > 0) {
    await db
      .table("identity")
      .insert(records)
      .onConflict(["provider", "id"])
      .ignore();
  }
}
