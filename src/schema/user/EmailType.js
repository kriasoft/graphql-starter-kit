/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../node';

export default new GraphQLObjectType({
  name: 'Email',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    email: {
      type: new GraphQLNonNull(GraphQLString),
    },

    verified: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },

    primary: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});
