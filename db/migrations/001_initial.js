/**
 * The initial database schema.
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 *
 * @see https://knexjs.org/#Schema
 * @typedef {import("knex").Knex} Knex
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

  // https://www.postgresql.org/docs/current/uuid-ossp.html
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  // https://www.postgresql.org/docs/current/hstore.html
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "hstore"`);
  // https://www.postgresql.org/docs/current/citext.html
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "citext"`);

  // Custom data types (username, email, etc.)
  await db.raw(`CREATE DOMAIN username AS citext CHECK (VALUE ~ '^[0-9a-zA-Z._]{2,50}$')`);
  await db.raw(`CREATE DOMAIN email AS citext CHECK (VALUE ~ '^[^\\s@]+@([^\\s@.,]+\\.)+[^\\s@.,]{2,}$')`);

  // Custom UID types for better user experience (unlocks having short URLs etc.)
  await db.raw(`CREATE DOMAIN user_id AS TEXT CHECK(VALUE ~ '^[0-9a-z]{6}$')`);

  // Custom types
  await db.raw(`CREATE TYPE identity_provider AS ENUM (${idps.map(x => `'${x}'`).join(', ')})`);

  await db.schema.createTable("user", (table) => {
    table.specificType("id", "user_id").notNullable().primary();
    table.specificType("username", "username").notNullable().unique();
    table.specificType("email", "email").index();
    table.boolean("email_verified").notNullable().defaultTo(false);
    table.string("password", 60); // 60-character bcrypt hash string
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

  await db.schema.createTable("identity", (table) => {
    table.specificType("provider", "identity_provider").notNullable();
    table.string("id", 36).notNullable();
    table.specificType("user_id", "user_id").notNullable().references("id").inTable("user").onDelete("CASCADE").onUpdate("CASCADE");
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
};

module.exports.down = async (/** @type {Knex} */ db) => {
  await db.schema.dropTableIfExists("identity");
  await db.schema.dropTableIfExists("user");
  await db.raw("DROP TYPE IF EXISTS identity_provider");
  await db.raw("DROP DOMAIN IF EXISTS user_id");
};

module.exports.configuration = { transaction: true };
