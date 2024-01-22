/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { Knex } from "knex";

/**
 * The initial database schema (migration).
 * @see https://knexjs.org/#Schema
 */
export async function up(db: Knex) {
  // PostgreSQL extensions.
  // https://cloud.google.com/sql/docs/postgres/extensions
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "hstore"`);
  await db.raw(`CREATE EXTENSION IF NOT EXISTS "citext"`);
  // await db.raw(`CREATE EXTENSION IF NOT EXISTS "pgvector"`);

  // User roles.
  await db.raw(`CREATE TYPE user_role AS ENUM ('owner', 'member')`);

  // User accounts (excluding fields from the auth provider).
  await db.schema.createTable("user", (table) => {
    table.string("id", 40).notNullable().primary();
    table.string("time_zone", 50); // E.g. "America/New_York"
    table.string("locale", 10); // E.g. "en-US"
  });

  // User workspaces/organizations.
  await db.schema.createTable("workspace", (table) => {
    table.string("id", 40).notNullable().primary();
    table.string("owner_id", 40).notNullable();
    table.string("name", 50).notNullable();
    table.timestamp("created_at").notNullable().defaultTo(db.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(db.fn.now());

    table.foreign("owner_id").references("user.id").onUpdate("CASCADE");
  });

  // User memberships in workspaces/organizations.
  await db.schema.createTable("workspace_member", (table) => {
    table.string("workspace_id", 40).notNullable();
    table.string("user_id", 40).notNullable();
    table.specificType("role", "user_role").notNullable().defaultTo("member");

    table.primary(["workspace_id", "user_id"]);
    table
      .foreign("workspace_id")
      .references("workspace.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .foreign("user_id")
      .references("user.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

/**
 * Rollback function for the migration.
 */
export async function down(db: Knex) {
  await db.schema.dropTableIfExists("workspace_member");
  await db.schema.dropTableIfExists("workspace");
  await db.schema.dropTableIfExists("user");
  await db.raw(`DROP TYPE IF EXISTS user_role`);
}

export const config = { transaction: true };
