/**
 * The initial database schema.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 *
 * @see https://knexjs.org/#Schema
 * @typedef {import("knex")} Knex
 */

// OAuth identity providers
const idps = [
  "google", // Google (google.com)
  "apple", // Apple (apple.com)
  "facebook", // Facebook (facebook.com)
  "github", // GitHub (github.com)
  "linkedin", // LinkedIn (linkedin.com)
  "microsoft", // Microsoft (microsoft.com)
  "twitter", // Twitter (twitter.com)
  "yahoo", // Yahoo (yahoo.com)
  "gamecenter", // Apple Game Center (gc.apple.com)
  "playgames", // Google Play Games (playgames.google.com)
];

module.exports.up = async (/** @type {Knex} */ db) /* prettier-ignore */ => {
  // PostgreSQL extensions
  // https://cloud.google.com/sql/docs/postgres/extensions
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "hstore"`);

  // Custom UID types for better user experience (unlocks having short URLs etc.)
  await db.raw(`CREATE DOMAIN user_id AS TEXT CHECK(VALUE ~ '^[0-9a-z]{6}$')`);

  // Custom types
  await db.raw(`CREATE TYPE identity_provider AS ENUM (${idps.map(x => `'${x}'`).join(', ')})`);

  await db.schema.createTable("users", (table) => {
    table.specificType("id", "user_id").notNullable().primary();
    table.string("username", 50).notNullable().unique();
    table.string("email", 100);
    table.boolean("email_verified").notNullable().defaultTo(false);
    table.string("name", 100);
    table.string("picture", 250);
    table.string("given_name", 100);
    table.string("family_name", 100);
    table.string("time_zone", 50);
    table.string("locale", 10);
    table.boolean("admin").notNullable().defaultTo(false);
    table.boolean("blocked").notNullable().defaultTo(false);
    table.boolean("archived").notNullable().defaultTo(false);
    table.timestamps(false, true);
    table.timestamp("last_login");
  });

  await db.schema.createTable("identities", (table) => {
    table.specificType("provider", "identity_provider").notNullable();
    table.string("id", 36).notNullable();
    table.specificType("user_id", "user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
    table.text("username");
    table.text("email");
    table.boolean("email_verified");
    table.text("name");
    table.text("picture");
    table.text("given_name");
    table.text("family_name");
    table.text("locale");
    table.text("access_token");
    table.text("refresh_token");
    table.specificType("scopes", "text[]").notNullable().defaultTo("{}");
    table.text("token_type");
    table.timestamps(false, true);
    table.timestamp("issued_at");
    table.timestamp("expires_at");
    table.primary(["provider", "id"]);
  });

  await db.schema.createTable("stories", (table) => {
    table.uuid("id").notNullable().defaultTo(db.raw("uuid_generate_v4()")).primary();
    table.specificType("author_id", "user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
    table.string("slug", 120).notNullable();
    table.string("title", 120).notNullable();
    table.string("text", 2000);
    table.boolean("is_url").notNullable().defaultTo(false);
    table.boolean("approved").notNullable().defaultTo(false);
    table.timestamps(false, true);
  });

  await db.schema.createTable("story_points", (table) => {
    table.uuid("story_id").references("id").inTable("stories").onDelete("CASCADE").onUpdate("CASCADE");
    table.specificType("user_id", "user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
    table.primary(["story_id", "user_id"]);
  });

  await db.schema.createTable("comments", (table) => {
    table.uuid("id").notNullable().defaultTo(db.raw("uuid_generate_v4()")).primary();
    table.uuid("story_id").notNullable().references("id").inTable("stories").onDelete("CASCADE").onUpdate("CASCADE");
    table.uuid("parent_id").references("id").inTable("comments").onDelete("CASCADE").onUpdate("CASCADE");
    table.specificType("author_id", "user_id").notNullable().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
    table.text("text");
    table.timestamps(false, true);
  });

  await db.schema.createTable("comment_points", (table) => {
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
  await db.raw("DROP TYPE IF EXISTS identity_provider");
  await db.raw("DROP DOMAIN IF EXISTS user_id");
};

module.exports.configuration = { transaction: true };
