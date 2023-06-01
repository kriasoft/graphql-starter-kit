/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { GraphQLObjectType, GraphQLSchema } from "graphql";
import * as mutations from "./mutations";
import * as queries from "./queries";

/**
 * GraphQL API schema.
 */
export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Root",
    description: "The top-level GraphQL API.",
    fields: queries,
  }),

  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: mutations,
  }),
});
