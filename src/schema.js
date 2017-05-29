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

import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { connectionArgs, connectionDefinitions, connectionFromArray } from 'graphql-relay';
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
        }).connectionType,
        args: connectionArgs,
        async resolve(root, args) {
          const stories = await db.table('stories').select('*')
            .then(rows => rows.map(x => Object.assign(x, { __type: 'Story' })));
          return connectionFromArray(stories, args);
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
