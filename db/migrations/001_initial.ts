/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Knex } from "knex";

/**
 * The initial database schema (migration).
 * @see https://knexjs.org/#Schema
 */
export async function up(db: Knex) {
  // OAuth identity providers
  const idps = [
    "google",     // Google (google.com)
    "apple",      // Apple (apple.com)
    "facebook",   // Facebook (facebook.com)
    "github",     // GitHub (github.com)
    "linkedin",   // LinkedIn (linkedin.com)
    "microsoft",  // Microsoft (microsoft.com)
    "twitter",    // Twitter (twitter.com)
    "yahoo",      // Yahoo (yahoo.com)
    "gamecenter", // Apple Game Center (gc.apple.com)
    "playgames",  // Google Play Games (playgames.google.com)
  ]; /* prettier-ignore */

  const userActionTypes = ["reset_password", "login_failed"];

  // PostgreSQL extensions
  // https://cloud.google.com/sql/docs/postgres/extensions
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "hstore"`);
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "citext"`);

  // Custom data types (username, email, custom IDs, enums, etc.)
  await db.raw(`CREATE DOMAIN short_id AS text CHECK(VALUE ~ '^[0-9a-z]{3,10}$')`); // prettier-ignore
  await db.raw(`CREATE DOMAIN username AS citext CHECK (VALUE ~ '^[0-9a-zA-Z._]{2,30}$')`); // prettier-ignore
  await db.raw(`CREATE DOMAIN email AS citext CHECK (VALUE ~ '^[^\\s@]+@([^\\s@.,]+\\.)+[^\\s@.,]{2,}$')`); // prettier-ignore
  await db.raw(`CREATE TYPE identity_provider AS ENUM (${idps.map((x) => `'${x}'`).join(", ")})`); // prettier-ignore
  await db.raw(`CREATE TYPE user_action_type AS ENUM (${userActionTypes.map(x => `'${x}'`).join(', ')})`); // prettier-ignore

  // User accounts
  await db.schema.createTable("user", (table) => {
    table.specificType("id", "short_id").notNullable().primary();
    table.specificType("username", "username").notNullable().unique();
    table.specificType("email", "email").index();
    table.boolean("email_verified").notNullable().defaultTo(false);
    table.string("password", 100); // Argon2 hash string
    table.string("name", 50); // Display name
    table.string("given_name", 50);
    table.string("family_name", 50);
    // Profile picture, e.g. { filename: "/u/abc.jpg", width: 60, height: 60, version: 1 }
    table.jsonb("picture").notNullable().defaultTo("{}");
    table.string("time_zone", 50); // E.g. "America/New_York"
    table.string("locale", 10); // E.g. "en-US"
    table.boolean("admin").notNullable().defaultTo(false).index();
    table.timestamp("created").notNullable().defaultTo(db.fn.now()).index();
    table.timestamp("updated").notNullable().defaultTo(db.fn.now());
    table.timestamp("deleted");
    table.timestamp("last_login");
  });

  // 3rd party credentials (Google, Apple, etc.)
  await db.schema.createTable("identity", (table) => {
    table.specificType("provider", "identity_provider").notNullable();
    table.string("id", 36).notNullable();
    table
      .specificType("user_id", "short_id")
      .notNullable()
      .references("user.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.specificType("username", "citext").index();
    table.specificType("email", "citext").index();
    table.jsonb("profile").notNullable().defaultTo("{}");
    table.jsonb("credentials").notNullable().defaultTo("{}");
    table.timestamp("created").notNullable().defaultTo(db.fn.now());
    table.timestamp("updated").notNullable().defaultTo(db.fn.now());
    table.primary(["provider", "id"]);
  });

  await db.schema.createTable("user_action", (table) => {
    table
      .uuid("id")
      .notNullable()
      .defaultTo(db.raw("uuid_generate_v4()"))
      .primary();
    table
      .specificType("user_id", "short_id")
      .notNullable()
      .references("user.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
      .index();
    table.specificType("action", "user_action_type").notNullable().index();
    table.jsonb("metadata").notNullable().defaultTo("{}");
    table.timestamp("created").notNullable().defaultTo(db.fn.now()).index();
    table.timestamp("updated").notNullable().defaultTo(db.fn.now());
  });
}

/**
 * Rollback function for the migration.
 */
export async function down(db: Knex) {
  await db.schema.dropTableIfExists("user_action");
  await db.schema.dropTableIfExists("identity");
  await db.schema.dropTableIfExists("user");
  await db.raw("DROP DOMAIN IF EXISTS short_id");
  await db.raw("DROP DOMAIN IF EXISTS username");
  await db.raw("DROP DOMAIN IF EXISTS email");
  await db.raw("DROP TYPE IF EXISTS identity_provider");
  await db.raw("DROP TYPE IF EXISTS user_action_type");
}

export const configuration = { transaction: true };
