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

import { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs, connectionFromArraySlice, cursorToOffset } from 'graphql-relay';
import { nodeField, nodesField } from './types/Node';

import db from './db';
import StoryType from './types/StoryType';
import UserType from './types/UserType';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      nodes: nodesField,

      me: {
        type: UserType,
        resolve(root, args, { user, users }) {
          return user && users.load(user.id);
        },
      },

      stories: {
        type: connectionDefinitions({
          name: 'Story',
          nodeType: StoryType,
          connectionFields: {
            totalCount: { type: new GraphQLNonNull(GraphQLInt) },
          },
        }).connectionType,
        args: forwardConnectionArgs,
        async resolve(root, args) {
          const limit = typeof args.first === 'undefined' ? '10' : args.first;
          const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

          const [data, totalCount] = await Promise.all([
            db.table('stories')
              .orderBy('created_at', 'desc')
              .limit(limit).offset(offset)
              .then(rows => rows.map(x => Object.assign(x, { __type: 'Story' }))),
            db.table('stories')
              .count().then(x => x[0].count),
          ]);

          return {
            ...connectionFromArraySlice(data, args, {
              sliceStart: offset,
              arrayLength: totalCount,
            }),
            totalCount,
          };
        },
      },
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...require('./mutations/story').default,
      ...require('./mutations/comment').default,
    },
  }),
});
