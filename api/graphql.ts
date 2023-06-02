/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Request, Response } from "express";
import { GraphQLError, printSchema } from "graphql";
import { createHandler } from "graphql-http";
import { isHttpError } from "http-errors";
import { writeFile } from "node:fs/promises";
import { ZodError } from "zod";
import { Context, log } from "./core/index";
import env from "./env";
import schema from "./schema";

/**
 * GraphQL middleware for Express.js
 */
async function handleGraphQL(req: Request, res: Response) {
  // Render GraphiQL UI
  // https://github.com/graphql/graphiql
  if (req.method === "GET" && req.accepts("text/html")) {
    res.render("api", {
      projectId: env.GOOGLE_CLOUD_PROJECT,
      appId: env.FIREBASE_APP_ID,
      apiKey: env.FIREBASE_API_KEY,
      authDomain: env.FIREBASE_AUTH_DOMAIN,
    });
    return;
  }

  const handle = createHandler<Request, { res: Response }, Context>({
    schema,
    context(req, params) {
      return new Context(req, params);
    },
    formatError(err) {
      if (err instanceof GraphQLError) {
        // Append the statusCode, formErrors, and fieldErrors fields
        // to the error response.
        if (err.originalError instanceof ZodError) {
          const zodError = err.originalError;
          const json = { ...err.toJSON(), message: err.message };
          const message = "Invalid input.";
          const errors = zodError.flatten();
          err.toJSON = () => ({ ...json, ...errors, message, statusCode: 422 });
        }
        // Otherwise, append just the statusCode field to the error response.
        else if (isHttpError(err.originalError)) {
          const json = { ...err.toJSON(), message: err.message };
          const statusCode = err.originalError.status;
          err.toJSON = () => ({ ...json, statusCode });
          log(req, "ERROR", err.originalError);
        } else {
          log(req, "ERROR", err.originalError || err);
        }
      } else {
        log(req, "ERROR", err);
      }

      return err;
    },
  });

  try {
    const [body, init] = await handle({
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
      raw: req,
      context: { res },
    });
    res.writeHead(init.status, init.statusText, init.headers);
    res.end(body);
  } catch (err) {
    log(req, "ERROR", err as Error);
    res.writeHead(500);
    res.end();
  }
}

async function updateSchema(): Promise<void> {
  const output = printSchema(schema);
  await writeFile("./schema.graphql", output, { encoding: "utf-8" });
}

export { handleGraphQL, updateSchema };
