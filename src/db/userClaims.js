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

export function any(userId: number, claimType: string) {
  return db.query(
    'SELECT EXISTS(SELECT 1 FROM user_claims WHERE user_id = $1 AND type = $2)',
    [userId, claimType]).then(x => x.rows[0].exists);
}

export function create(userId: number, claimType: string, value: string) {
  return db.query(
    'INSERT INTO user_claims (user_id, type, value) VALUES ($1, $2, $3)',
    [userId, claimType, value]);
}

export function update(userId: number, claimType: string, value: string) {
  return db.query(
    'UPDATE user_claims SET value = $1 WHERE user_id = $2 AND type = $3',
    [value, userId, claimType]);
}

export async function createOrUpdate(userId: number, claimType: string, value: string) {
  if (await any(userId, claimType)) {
    await update(userId, claimType, value);
  } else {
    await create(userId, claimType, value);
  }
}
