/**
 * The GraphQL API schema.
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import fs from "fs";
import { GraphQLObjectType, GraphQLSchema, printSchema } from "graphql";
import { noop } from "lodash";
import path from "path";
import * as mutations from "./mutations";
import { nodeField, nodesField } from "./node";
import * as queries from "./queries";

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
