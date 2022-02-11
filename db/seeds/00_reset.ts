/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type Knex } from "knex";

/**
 * Remove the existing db records before seeding.
 */
export async function seed(db: Knex) {
  await db.raw("SELECT version()");
  // await db.table("identity").delete();
  // await db.table("user").delete();
}
