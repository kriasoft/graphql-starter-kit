/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// Create database schema for storing user accounts, logins and authentication claims/tokens
// Source https://github.com/membership/membership.db
module.exports.up = async (db) => {
  // PostgreSQL extensions (may require superuser or database owner priveleges)
  await db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await db.raw('CREATE EXTENSION IF NOT EXISTS "hstore"');

  await db.schema.createTable('users', (table) => {
    // UUID v1mc reduces the negative side effect of using random primary keys
    // with respect to keyspace fragmentation on disk for the tables because it's time based
    // https://www.postgresql.org/docs/current/static/uuid-ossp.html
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('email').unique();
    table.boolean('email_confirmed').notNullable().defaultTo(false);
    table.string('password_hash', 100);
    table.string('security_stamp', 100);
    table.uuid('concurrency_stamp').notNullable().defaultTo(db.raw('uuid_generate_v4()'));
    table.string('phone_number', 50);
    table.boolean('phone_number_confirmed').notNullable().defaultTo(false);
    table.boolean('two_factor_enabled').notNullable().defaultTo(false);
    table.timestamp('lockout_end');
    table.boolean('lockout_enabled').notNullable().defaultTo(false);
    table.smallint('access_failed_count').notNullable().defaultTo(0);
  });

  await db.schema.createTable('user_logins', (table) => {
    table.string('name', 50).notNullable();
    table.string('key', 100).notNullable();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.primary(['name', 'key']);
  });

  await db.schema.createTable('user_claims', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('type');
    table.string('value', 400);
  });

  await db.schema.createTable('stories', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.uuid('author_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('title', 80).notNullable();
    table.string('url', 200);
    table.string('text', 2000);
    table.integer('points_count').notNullable().defaultTo(0);
    table.integer('comments_count').notNullable().defaultTo(0);
    table.timestamps(false, true);
  });

  await db.schema.createTable('comments', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.uuid('story_id').notNullable().references('id').inTable('stories').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('parent_id').references('id').inTable('comments').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('author_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('text', 2000);
    table.integer('points_count').notNullable().defaultTo(0);
    table.timestamps(false, true);
  });

  await db.schema.createTable('points', (table) => {
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('story_id').references('id').inTable('stories').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('comment_id').references('id').inTable('comments').onDelete('CASCADE').onUpdate('CASCADE');
    table.primary(['user_id', 'story_id', 'comment_id']);
  });
};

module.exports.down = async (db) => {
  await db.schema.dropTableIfExists('points');
  await db.schema.dropTableIfExists('comments');
  await db.schema.dropTableIfExists('stories');
  await db.schema.dropTableIfExists('user_claims');
  await db.schema.dropTableIfExists('user_logins');
  await db.schema.dropTableIfExists('users');
};

module.exports.configuration = { transaction: true };
