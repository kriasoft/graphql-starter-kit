/**
 * GraphQL API Starter Kit for Node.js
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { Router, Request } from "express";
import { graphqlHTTP } from "express-graphql";
import { express as voyager } from "graphql-voyager/middleware";

import env from "./env";
import { auth } from "./auth";
import { session } from "./session";
import { schema } from "./schema";
import { Context } from "./context";

export const api = Router();

api.use(session);
api.use(auth);

// Generates interactive UML diagram for the API schema
// https://github.com/APIs-guru/graphql-voyager
if (env.APP_ENV !== "production") {
  api.use("/graphql/model", voyager({ endpointUrl: "/graphql" }));
}

api.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema,
    context: new Context(req as Request),
    graphiql: env.APP_ENV !== "production",
    pretty: !env.isProduction,
    customFormatErrorFn: (err) => {
      console.error(err.originalError || err);
      return err;
    },
  })),
);
