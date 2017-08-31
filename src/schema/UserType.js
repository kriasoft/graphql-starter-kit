/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLObjectType, GraphQLList, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import EmailType from './EmailType';
import { nodeInterface } from './Node';

export default new GraphQLObjectType({
  name: 'User',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    displayName: {
      type: GraphQLString,
      resolve(parent) {
        return parent.display_name;
      },
    },

    imageUrl: {
      type: GraphQLString,
      resolve(parent) {
        return parent.image_url;
      },
    },

    emails: {
      type: new GraphQLList(EmailType),
      resolve(parent, args, { user, emailsByUserId }) {
        return parent.id === user.id ? emailsByUserId.load(parent.id) : null;
      },
    },
  },
});
