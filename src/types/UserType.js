/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './Node';

export default new GraphQLObjectType({
  name: 'User',

  fields: {
    id: globalIdField(),

    email: {
      type: GraphQLString,
      resolve(parent, args, { user }) {
        return user && parent.id === user.id ? parent.email : null;
      },
    },
  },

  interfaces: [
    nodeInterface,
  ],
});
