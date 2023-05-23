/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { NextFunction, Request, Response } from "express";
import { GraphQLError, printSchema } from "graphql";
import { HttpError } from "http-errors";
import fs from "node:fs/promises";
import { ValidationError } from "validator-fluent";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "./core/helix.js";
import { Context, log } from "./core/index.js";
import env from "./env.js";
import schema from "./schema.js";

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
      res.send(
        renderGraphiQL({
          endpoint: "/api",
        }).replace("</body>", `${authScript}\n</body>`),
      );
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

const authScript = `
    <script type="module">
      import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
      import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

      const app = initializeApp({
        projectId: "${env.GOOGLE_CLOUD_PROJECT}",
        appId: "${env.FIREBASE_APP_ID}",
        apiKey: "${env.FIREBASE_API_KEY}",
        authDomain: "${env.FIREBASE_AUTH_DOMAIN}"
      });

      function setAuthHeader(token) {
        const editor = document.querySelectorAll('.variable-editor .CodeMirror')[1].CodeMirror;
        const headers = JSON.parse(editor.getValue());
        headers.Authorization = token ? "Bearer " + token : undefined;
        editor.setValue(JSON.stringify(headers, null, 2));
      }

      getAuth(app).onIdTokenChanged((user) => {
        if (user) {
          user.getIdToken().then(token => setAuthHeader(token));
        } else {
          setAuthHeader(null);
        }
      });
    </script>
`;

export { handleGraphQL, updateSchema };
