/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const { GraphQLObjectType } = require('graphql');
const User = require('./User');

module.exports = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    user: {
      type: User,
      resolve(root, args, { user }) {
        return user;
      },
    },
  },
});
