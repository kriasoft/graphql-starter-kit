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
import Article from './models/Article';
import User from './models/User';

/**
 * Data access utility to be used with GraphQL resolve() functions. For example:
 *
 *   new GraphQLObjectType({
 *     ...
 *     resolve(post, args, { loader }) {
 *       return loader.users.load(post.authorId);
 *     }
 *   })
 *
 * For more information visit https://github.com/facebook/dataloader
 */
export default {
  create: () => ({
    users: new DataLoader(keys => User.findByIds(keys)),
    articles: new DataLoader(keys => Article.findByIds(keys)),
  }),
};
