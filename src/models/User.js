/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import db from '../db';

const fields = [
  'id',
  'email',
];

class User {
  id: string;
  email: string;

  constructor(props: any) {
    Object.assign(this, props);
  }

  static find(...args) {
    return db.table('users')
      .where(...(args.length ? args : [{}]))
      .select(...fields)
      .then(rows => rows.map(x => new User(x)));
  }

  static findOne(...args): Promise<User> {
    return db.table('users')
      .where(...(args.length ? args : [{}]))
      .first(...fields)
      .then(x => x && new User(x));
  }

  static findOneByLogin(provider: string, key: string) {
    return db.table('users')
      .leftJoin('user_logins', 'users.id', 'user_logins.user_id')
      .where({ 'user_logins.name': provider, 'user_logins.key': key })
      .first(...fields)
      .then(x => x && new User(x));
  }

  static any(...args): boolean {
    return db.raw('SELECT EXISTS ?', db.table('users').where(...(args.length ? args : [{}])).select(db.raw('1')))
      .then(x => x.rows[0].exists);
  }

  static create(user) {
    return db.table('users')
      .insert(user, fields).then(x => new User(x[0]));
  }

  static setClaims(userId, provider, providerKey, claims) {
    return db.transaction(trx => Promise.all([
      trx.table('user_logins').insert({
        user_id: userId,
        name: provider,
        key: providerKey,
      }),
      ...claims.map(claim => trx.raw('SELECT EXISTS ?', trx.table('user_claims')
        .where({ user_id: userId, type: claim.type }))
        .then(x => x.rows[0].exists ? // eslint-disable-line no-confusing-arrow
          trx.table('user_claims')
            .where({ user_id: userId, type: claim.type })
            .update({ value: claim.value }) :
          trx.table('user_claims')
            .insert({ user_id: userId, type: claim.type, value: claim.value }))),
    ]));
  }
}

export default User;
