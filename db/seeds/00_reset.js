/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Remove the existing db records before seeding.
 *
 * @param {import("knex").Knex} db
 */
module.exports.seed = async function seed(db) {
  await db.raw("SELECT version()");
  // await db.table("identity").delete();
  // await db.table("user").delete();
};
