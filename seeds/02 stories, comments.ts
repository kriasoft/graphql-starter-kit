/**
 * Test data set (run `yarn db-seed --env=?`)
 * https://knexjs.org/#Seeds-API
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import Knex from 'knex';

export async function seed(db: Knex): Promise<void> {
  // TODO: Generate stories and comments
  await db.raw('SELECT version()');
}
