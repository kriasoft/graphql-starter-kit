/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLObjectType } from 'graphql';
import { connectionArgs, connectionDefinitions, connectionFromPromisedArray } from 'graphql-relay';
import Article from '../models/Article';
import UserType from './UserType';
import ArticleType from './ArticleType';

const articles = connectionDefinitions({ name: 'Article', nodeType: ArticleType });

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    me: {
      type: UserType,
      resolve(root, args, { user }) {
        return user;
      },
    },
    articles: {
      type: articles.connectionType,
      description: 'Featured articles',
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(Article.find(), args),
    },
  },
});
