/**
 * Initial database schema (run `yarn db-migrate --env=?`)
 * https://knexjs.org/#Schema
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import * as Knex from 'knex';

// prettier-ignore
export async function up(db: Knex): Promise<void> {
  await db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await db.raw('CREATE EXTENSION IF NOT EXISTS "hstore"');

  await db.schema.createTable('users', table => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v4()')).primary();
    table.string('username', 50).notNullable().unique();
    table.string('email', 100);
    table.string('display_name', 100);
    table.string('photo_url', 250);
    table.string('time_zone', 50);
    table.jsonb('claims').notNullable().defaultTo('{}');
    table.timestamps(false, true);
    table.timestamp('last_login_at').notNullable().defaultTo(db.fn.now());
  });

  await db.schema.createTable('stories', table => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v4()')).primary();
    table.uuid('author_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('slug', 120).notNullable();
    table.string('title', 120).notNullable();
    table.string('text', 2000);
    table.boolean('is_url').notNullable().defaultTo(false);
    table.boolean('approved').notNullable().defaultTo(false);
    table.timestamps(false, true);
  });

  await db.schema.createTable('story_points', table => {
    table.uuid('story_id').references('id').inTable('stories').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.primary(['story_id', 'user_id']);
  });

  await db.schema.createTable('comments', table => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v4()')).primary();
    table.uuid('story_id').notNullable().references('id').inTable('stories').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('parent_id').references('id').inTable('comments').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('author_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.text('text');
    table.timestamps(false, true);
  });

  await db.schema.createTable('comment_points', table => {
    table.uuid('comment_id').references('id').inTable('comments').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.primary(['comment_id', 'user_id']);
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('comment_points');
  await db.schema.dropTableIfExists('comments');
  await db.schema.dropTableIfExists('story_points');
  await db.schema.dropTableIfExists('stories');
  await db.schema.dropTableIfExists('users');
}

export const configuration = { transaction: true };
