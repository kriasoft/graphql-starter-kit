/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Knex } from "knex";

/**
 * The initial database schema (migration).
 * @see https://knexjs.org/#Schema
 */
export async function up(db: Knex) {
  // PostgreSQL extensions
  // https://cloud.google.com/sql/docs/postgres/extensions
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "hstore"`);
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "citext"`);

  // Custom data types (username, email, custom IDs, enums, etc.)
  await db.raw(`CREATE DOMAIN short_id AS text CHECK(VALUE ~ '^[0-9A-Za-z-]{3,40}$')`); // prettier-ignore
  await db.raw(`CREATE DOMAIN email AS citext CHECK (VALUE ~ '^[^\\s@]+@([^\\s@.,]+\\.)+[^\\s@.,]{2,}$')`); // prettier-ignore

  // User accounts
  await db.schema.createTable("user", (table) => {
    table.specificType("id", "short_id").notNullable().primary();
    table.specificType("email", "email").index();
    table.boolean("email_verified").notNullable().defaultTo(false);
    table.string("name", 50); // Display name
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
}

/**
 * Rollback function for the migration.
 */
export async function down(db: Knex) {
  await db.schema.dropTableIfExists("user");
  await db.raw("DROP DOMAIN IF EXISTS short_id");
  await db.raw("DROP DOMAIN IF EXISTS email");
}

export const configuration = { transaction: true };
