/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './Node';

import UserType from './UserType';

export default new GraphQLObjectType({
  name: 'Story',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    author: {
      type: new GraphQLNonNull(UserType),
      resolve(parent, args, { users }) {
        return users.load(parent.author_id);
      },
    },

    title: {
      type: new GraphQLNonNull(GraphQLString),
    },

    url: {
      type: GraphQLString,
    },

    text: {
      type: GraphQLString,
    },

    pointsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(parent) {
        return parent.points_count;
      },
    },

    commentsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(parent) {
        return parent.comments_count;
      },
    },

    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.created_at;
      },
    },

    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.updated_at;
      },
    },
  },
});
