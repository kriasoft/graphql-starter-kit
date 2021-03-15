/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

const fs = require("fs");
const jsonFile = `${__filename.substring(0, __filename.lastIndexOf("."))}.json`;

/**
 * Seeds the database with test / reference user identities.
 *
 * @param {import("knex").Knex} db
 */
module.exports.seed = async (db) => {
  let records = JSON.parse(fs.readFileSync(jsonFile));
  if (records.length > 0) {
    await db.table("identity").insert(records);
  }
};
