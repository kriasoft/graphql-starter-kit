/**
 * The GraphQL API schema.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { GraphQLSchema, GraphQLObjectType } from "graphql";

import * as queries from "./queries";
import * as mutations from "./mutations";
import { nodeField, nodesField } from "./node";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Root",
    description: "The top-level API",

    fields: {
      node: nodeField,
      nodes: nodesField,
      ...queries,
    },
  }),

  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: mutations,
  }),
});
