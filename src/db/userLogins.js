/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import db from './pool';

export function any(provider: string, key: string) {
  return db.query(
    'SELECT EXISTS(SELECT 1 FROM user_logins WHERE name = $1 AND key = $2)',
    [provider, key]).then(x => x.rows[0].exists);
}

export async function create(userId: number, provider: string, key: string) {
  await db.query(
    'INSERT INTO user_logins (user_id, name, key) VALUES ($1, $2, $3)',
    [userId, provider, key]);
}
