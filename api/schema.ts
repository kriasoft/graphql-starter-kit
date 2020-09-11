/**
 * The GraphQL API schema.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import fs from "fs";
import path from "path";
import { noop } from "lodash";
import { printSchema, GraphQLSchema, GraphQLObjectType } from "graphql";

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

export function updateSchema(cb: fs.NoParamCallback = noop): void {
  const file = path.resolve(__dirname, "./schema.graphql");
  const output = printSchema(schema, { commentDescriptions: true });
  fs.writeFile(file, output, { encoding: "utf-8" }, cb);
}
