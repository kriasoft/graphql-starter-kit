/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import knex from 'knex';
import Client from 'knex/lib/dialects/postgres';
import Formatter from 'knex/lib/formatter';

// Converts "camelCase" strings to "snake_case"
const toSnakeCase = (cache => (key: string) => {
  let snakeCaseKey = cache.get(key);
  if (!snakeCaseKey) {
    snakeCaseKey = key.replace(/([A-Z])/g, (_, s) => `_${s.toLowerCase()}`);
    cache.set(key, snakeCaseKey);
  }
  return snakeCaseKey;
})(new Map());

// Automatically convert "camelCase" identifiers to "snake_case". For example:
//   db.table('users').where('userId', '=', 1).update({ firstName: 'Bill' })
//   => UPDATE "users" SET "first_name" = ? WHERE "user_id" = ?
Client.prototype.wrapIdentifier = (value) => {
  if (value === '*') return value;
  const matched = value.match(/(.*?)(\[[0-9]\])/);
  if (matched) return Client.prototype.wrapIdentifier.wrapIdentifier(matched[1]) + matched[2];
  return `"${toSnakeCase(value).replace(/"/g, '""')}"`;
};

// The above should not apply to the "as <name>" identifiers. For example:
// db.table('users').select('user_id as userId') => SELECT "user_id" as "userId" from "users"
Formatter.prototype.wrapAsIdentifier = value => `"${(value || '').replace(/"/g, '""')}"`;

const db = knex({
  client: Client,
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: 'migrations',
  },
  debug: process.env.DATABASE_DEBUG === 'true',
});

export default db;
