/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import * as queries from './queries';
import * as mutations from './mutations';
import { nodeField, nodesField } from './node';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      nodes: nodesField,
      // ...queries,
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {}, //mutations,
  }),
});
