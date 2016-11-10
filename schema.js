/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const Viewer = require('./types/Viewer');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      viewer: {
        type: Viewer,
        resolve() {
          return Object.create(null);
        },
      },
    },
  }),
});
