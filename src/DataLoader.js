/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable global-require */

import DataLoader from 'dataloader';
import db from './db';

// Appends type information to a data row, e.g. { id: 1 } => { __type: 'User', id: 1 };
function appendType(row: ?any, type: string) {
  // eslint-disable-next-line no-param-reassign, no-underscore-dangle
  if (row) row.__type = type;
  return row;
}

// Ensures that the order of rows matches the order of the keys
function normalize(type: string, keys: Array<number|string>, rows: Array<any>) {
  return keys.map(key => appendType(rows.find(x => x.id === key), type));
}

/**
 * Data access utility to be used with GraphQL resolve() functions. For example:
 *
 *   new GraphQLObjectType({
 *     ...
 *     resolve(post, args, { users }) {
 *       return users.load(post.author_id);
 *     }
 *   })
 *
 * For more information visit https://github.com/facebook/dataloader
 */
export default {
  create: () => ({
    users: new DataLoader(keys => db.table('users')
      .whereIn('id', keys)
      .select('*')
      .then(normalize.bind(null, 'User', keys))),

    stories: new DataLoader(keys => db.table('stories')
      .whereIn('id', keys)
      .select('*')
      .then(normalize.bind(null, 'Story', keys))),
  }),
};
