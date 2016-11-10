/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve(user) {
        return user.id;
      },
    },

    email: {
      type: GraphQLString,
      resolve(user) {
        return user.email;
      },
    },
  },
});
