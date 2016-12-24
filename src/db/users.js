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

export function findById(id: number) {
  return db
    .query('SELECT id, email FROM users WHERE id = $1', [id])
    .then(({ rows }) => rows.length ? rows[0] : null);
}

export function findByLogin(provider: string, key: string) {
  return db
    .query(`
      SELECT id, email FROM users AS u
        LEFT JOIN user_logins AS l ON l.user_id = u.id
      WHERE l.name = $1 AND l.key = $2`, [provider, key])
    .then(({ rows }) => rows.length ? rows[0] : null);
}

export function any(email: string) {
  return db.query('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)', [email])
    .then(x => x.rows[0].exists);
}

export function create(email: string) {
  return db.query('INSERT INTO users (email) VALUES ($1) RETURNING id', [email])
    .then(({ rows }) => findById(rows[0].id));
}
