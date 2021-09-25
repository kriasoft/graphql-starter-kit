/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Seeds the database with test / reference user identities.
 *
 * @param {import("knex").Knex} db
 */
module.exports.seed = async function seed(db) {
  const records = require(__filename.replace(/\.\w+$/, ".json"));

  if (records.length > 0) {
    await db.table("identity").insert(records).onConflict().ignore();
  }
};
