/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import type { Request } from "express";
import { graphqlHTTP } from "express-graphql";
import fs from "fs";
import {
  formatError,
  GraphQLObjectType,
  GraphQLSchema,
  printSchema,
} from "graphql";
import { noop } from "lodash";
import { Context } from "./context";
import { reportError } from "./core";
import env from "./env";
import * as mutations from "./mutations";
import * as queries from "./queries";
import { nodeField, nodesField } from "./types/node";
import { ValidationError } from "./utils";

/**
 * GraphQL API schema.
 */
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

/**
 * GraphQL middleware for Express.js
 */
export const graphql = graphqlHTTP((req, res, params) => ({
  schema,
  context: new Context(req as Request),
  graphiql: env.APP_ENV !== "prod",
  pretty: !env.isProduction,
  customFormatErrorFn: (err) => {
    if (err.originalError instanceof ValidationError) {
      return { ...formatError(err), errors: err.originalError.errors };
    }

    reportError(err.originalError || err, req as Request, params);
    console.error(err.originalError || err);
    return formatError(err);
  },
}));

export function updateSchema(cb: fs.NoParamCallback = noop): void {
  const output = printSchema(schema, { commentDescriptions: true });
  fs.writeFile("./schema.graphql", output, { encoding: "utf-8" }, cb);
}
