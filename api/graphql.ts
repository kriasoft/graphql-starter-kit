/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import type { NextFunction, Request, Response } from "express";
import { GraphQLError, printSchema } from "graphql";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { HttpError } from "http-errors";
import fs from "node:fs/promises";
import { ValidationError } from "validator-fluent";
import { Context, log } from "./core";
import schema from "./schema";

// Customize GraphQL error serialization
GraphQLError.prototype.toJSON = ((serialize) =>
  function toJSON(this: GraphQLError) {
    // The original serialized GraphQL error output
    const output = serialize.call(this as GraphQLError);

    // Append the `HttpError` code
    if (this.originalError instanceof HttpError) {
      output.status = this.originalError.statusCode;
    }

    // Append the list of user input validation errors
    if (this.originalError instanceof ValidationError) {
      output.status = 400;
      output.errors = this.originalError.errors;
    }

    return output;
  })(GraphQLError.prototype.toJSON);

/**
 * GraphQL middleware for Express.js
 */
async function handleGraphQL(req: Request, res: Response, next: NextFunction) {
  try {
    if (shouldRenderGraphiQL(req)) {
      res.send(renderGraphiQL({ endpoint: "/api" }));
    } else {
      const params = getGraphQLParameters(req);
      const result = await processRequest<Context>({
        operationName: params.operationName,
        query: params.query,
        variables: params.variables,
        request: req,
        schema,
        contextFactory: () => new Context(req, params),
      });

      sendResult(result, res, (result) => ({
        data: result.data,
        errors: result.errors?.map((err) => {
          if (!(err.originalError instanceof ValidationError)) {
            log(req, "ERROR", err.originalError ?? err, params);
          }
          return err;
        }),
      }));
    }
  } catch (err) {
    next(err);
  }
}

function updateSchema(): Promise<void> {
  const output = printSchema(schema);
  return fs.writeFile("./schema.graphql", output, { encoding: "utf-8" });
}

export { handleGraphQL, updateSchema };
