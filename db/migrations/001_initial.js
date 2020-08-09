/**
 * The initial database schema.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 *
 * @typedef {import("knex")} Knex
 */

module.exports.up = async (/** @type {Knex} */ db) /* prettier-ignore */ => {
  // PostgreSQL extensions
  // https://cloud.google.com/sql/docs/postgres/extensions
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "hstore"`);

  // Custom UID types for better user experience (unlocks having short URLs etc.)
  await db.raw(`CREATE DOMAIN user_id AS TEXT CHECK(VALUE ~ '^[0-9a-z]{6}$')`);

  await db.schema.createTable("users", table => {
    table.specificType("id", "user_id").notNullable().primary();
    table.string("username", 50).notNullable().unique();
    table.string("email", 100);
    table.string("display_name", 100);
    table.string("photo", 250);
    table.string("time_zone", 50);
    table.boolean("admin").notNullable().defaultTo(false);
    table.boolean("archived").notNullable().defaultTo(false);
    table.timestamps(false, true);
    table.timestamp("last_login_at");
  });

  await db.schema.createTable("stories", table => {
    table.uuid("id").notNullable().defaultTo(db.raw("uuid_generate_v4()")).primary();
    table.specificType("author_id", "user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
    table.string("slug", 120).notNullable();
    table.string("title", 120).notNullable();
    table.string("text", 2000);
    table.boolean("is_url").notNullable().defaultTo(false);
    table.boolean("approved").notNullable().defaultTo(false);
    table.timestamps(false, true);
  });

  await db.schema.createTable("story_points", table => {
    table.uuid("story_id").references("id").inTable("stories").onDelete("CASCADE").onUpdate("CASCADE");
    table.specificType("user_id", "user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
    table.primary(["story_id", "user_id"]);
  });

  await db.schema.createTable("comments", table => {
    table.uuid("id").notNullable().defaultTo(db.raw("uuid_generate_v4()")).primary();
    table.uuid("story_id").notNullable().references("id").inTable("stories").onDelete("CASCADE").onUpdate("CASCADE");
    table.uuid("parent_id").references("id").inTable("comments").onDelete("CASCADE").onUpdate("CASCADE");
    table.specificType("author_id", "user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
    table.text("text");
    table.timestamps(false, true);
  });

  await db.schema.createTable("comment_points", table => {
    table.uuid("comment_id").references("id").inTable("comments").onDelete("CASCADE").onUpdate("CASCADE");
    table.specificType("user_id", "user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
    table.primary(["comment_id", "user_id"]);
  });
};

module.exports.down = async (/** @type {Knex} */ db) => {
  await db.schema.dropTableIfExists("comment_points");
  await db.schema.dropTableIfExists("comments");
  await db.schema.dropTableIfExists("story_points");
  await db.schema.dropTableIfExists("stories");
  await db.schema.dropTableIfExists("users");
  await db.raw("DROP DOMAIN IF EXISTS user_id");
};

module.exports.configuration = { transaction: true };
