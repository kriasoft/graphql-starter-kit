/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { connectionArgs, connectionDefinitions, connectionFromPromisedArray } from 'graphql-relay';
import { nodeField, nodesField } from './types/Node';
import Article from './models/Article';
import ArticleType from './types/ArticleType';
import UserType from './types/UserType';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      nodes: nodesField,
      me: {
        type: UserType,
        resolve(root, args, { user }) {
          return user;
        },
      },
      articles: {
        type: connectionDefinitions({
          name: 'ArticleConnection',
          nodeType: ArticleType,
        }).connectionType,
        description: 'Featured articles',
        args: connectionArgs,
        resolve(root, args, { loader }) {
          return connectionFromPromisedArray(Article.find().then(items => items.map((x) => {
            loader.articles.prime(x.id, x);
            return x;
          })), args);
        },
      },
    },
  }),
});
