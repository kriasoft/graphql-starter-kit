/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

export function findById(client: any, id: number) {
  return client
    .query('SELECT id, email FROM users WHERE id = $1', [id])
    .then(({ rows }) => rows.length ? rows[0] : null);
}

export function findByLogin(client: any, provider: string, key: string) {
  return client
    .query(
      'SELECT id, email FROM users AS u ' +
      '  LEFT JOIN user_logins AS l ON l.user_id = u.id ' +
      'WHERE l.name = $1 AND l.key = $2',
      [provider, key])
    .then(({ rows }) => rows.length ? rows[0] : null);
}

export async function saveLogin(
  client: any,
  userId: number,
  provider: string,
  providerKey: string,
  accessToken: string,
  refreshToken: string,
) {
  await client.query(
    'INSERT INTO user_logins (user_id, name, key) VALUES ($1, $2, $3)',
    [userId, provider, providerKey]);

  await client.query(
    'UPDATE user_claims SET value = $3 WHERE user_id = $1 AND type = $2',
    [userId, `urn:${provider}:access_token`, accessToken]);

  await client.query(
    'INSERT INTO user_claims (user_id, type, value) ' +
    '  SELECT $1, $2, $3 ' +
    '  WHERE NOT EXISTS (SELECT 1 FROM user_claims WHERE user_id = $1 AND type = $2)',
    [userId, `urn:${provider}:access_token`, accessToken]);

  await client.query(
    'UPDATE user_claims SET value = $3 WHERE user_id = $1 AND type = $2',
    [userId, `urn:${provider}:refresh_token`, refreshToken]);

  await client.query(
    'INSERT INTO user_claims (user_id, type, value) ' +
    '  SELECT $1, $2, $3 ' +
    '  WHERE NOT EXISTS (SELECT 1 FROM user_claims WHERE user_id = $1 AND type = $2)',
    [userId, `urn:${provider}:refresh_token`, refreshToken]);
}
