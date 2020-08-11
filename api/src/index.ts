/**
 * GraphQL API Starter Kit for Node.js
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import firebase from "firebase-admin";
import { graphqlHTTP } from "express-graphql";
import { express as voyager } from "graphql-voyager/middleware";
import express, { Router, Request, Response } from "express";

import { auth } from "./auth";
import { schema } from "./schema";
import { Context } from "./context";

const port = process.env.PORT || 8080;

// Initialize Firebase Admin SDK
if (
  process.env.NODE_ENV === "production" ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  firebase.initializeApp();
}

export const api = Router();

api.use(auth);

// Generates interactive UML diagram for the API schema
// https://github.com/APIs-guru/graphql-voyager
if (process.env.APP_ENV !== "production") {
  api.use("/graphql/model", voyager({ endpointUrl: "/graphql" }));
}

api.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema,
    context: new Context(req as Request),
    graphiql: process.env.APP_ENV !== "production",
    pretty: process.env.NODE_ENV !== "production",
    customFormatErrorFn: (err) => {
      console.error(err.originalError || err);
      return err;
    },
  })),
);

if (process.env.NODE_ENV !== "production") {
  const app = express();

  app.use(api);
  app.get("/", (req: Request, res: Response) => {
    res.redirect("/graphql");
  });

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}/`);
  });
}
