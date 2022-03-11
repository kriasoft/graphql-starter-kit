/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type Knex } from "knex";

/**
 * Seeds the database with test / reference user identities.
 */
export async function seed(db: Knex) {
  const { default: records } = await import("./02_identities.json");

  if (records.length > 0) {
    await db
      .table("identity")
      .insert(records)
      .onConflict(["provider", "id"])
      .ignore();
  }
}
