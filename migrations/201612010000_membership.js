/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

module.exports.up = async (db) => {
  // PostgreSQL extensions
  await db.raw('CREATE EXTENSION "uuid-ossp"');
  await db.raw('CREATE EXTENSION "hstore"');

  await db.schema.createTable('users', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('email').unique();
    table.boolean('email_confirmed').notNullable().defaultTo(false);
    table.string('password_hash', 100);
    table.string('security_stamp', 100);
    table.uuid('concurrency_stamp').notNullable().defaultTo(db.raw('uuid_generate_v4()'));
    table.string('phone_number', 50);
    table.boolean('phone_number_confirmed').notNullable().defaultTo(false);
    table.boolean('two_factor_enabled').notNullable().defaultTo(false);
    table.timestamp('lockout_end', 'without time zone');
    table.boolean('lockout_enabled').notNullable().defaultTo(false);
    table.smallint('access_failed_count').notNullable().defaultTo(0);
  });

  await db.schema.createTable('user_logins', (table) => {
    table.string('name', 50).notNullable();
    table.string('key', 100).notNullable();
    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.primary(['name', 'key']);
  });

  await db.schema.createTable('user_claims', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('type');
    table.string('value', 400);
  });
};

module.exports.down = async (db) => {
  await db.schema.dropTableIfExists('user_claims');
  await db.schema.dropTableIfExists('user_logins');
  await db.schema.dropTableIfExists('users');
  await db.raw('DROP EXTENSION "hstore"');
  await db.raw('DROP EXTENSION "uuid-ossp"');
};

module.exports.configuration = { transaction: true };
