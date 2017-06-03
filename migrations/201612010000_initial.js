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
  // User accounts
  await db.schema.createTable('users', (table) => {
    // UUID v1mc reduces the negative side effect of using random primary keys
    // with respect to keyspace fragmentation on disk for the tables because it's time based
    // https://www.postgresql.org/docs/current/static/uuid-ossp.html
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('email').notNullable();
    table.boolean('email_verified').notNullable().defaultTo(false);
    table.string('display_name', 100);
    table.timestamps(false, true);
  });

  // External logins with security tokens (e.g. Google, Facebook, Twitter)
  await db.schema.createTable('logins', (table) => {
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('provider', 16).notNullable();
    table.string('id', 36).notNullable();
    table.string('username', 100);
    table.jsonb('tokens').notNullable();
    table.jsonb('profile').notNullable();
    table.timestamps(false, true);
    table.primary(['provider', 'id']);
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
  await db.schema.dropTableIfExists('logins');
  await db.schema.dropTableIfExists('users');
};

module.exports.configuration = { transaction: true };
