/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

/**
 * Remove the existing db records before seeding.
 *
 * @param {import("knex")} db
 */
module.exports.seed = async (db) => {
  await db.table("identity").delete();
  await db.table("user").delete();
};
