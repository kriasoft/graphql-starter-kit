/**
 * Removes the existing db records before seeding.
 *
 * @typedef {import("knex")} Knex
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

module.exports.seed = async (/** @type {Knex} */ db) => {
  await db.table("users").delete();
};
