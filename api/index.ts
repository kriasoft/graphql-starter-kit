/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import "./core/source-map-support.js";

import SendGrid from "@sendgrid/mail";
import { default as express } from "express";
import { getApps, initializeApp } from "firebase-admin/app";
import { NotFound } from "http-errors";
import { db, handleError } from "./core/index.js";
import { session } from "./core/session.js";
import env from "./env.js";
import { handleGraphQL, updateSchema } from "./graphql.js";
import { withViews } from "./views/index.js";

const api = withViews(express());

api.enable("trust proxy");
api.disable("x-powered-by");

api.use((req, res, next) => {
  if (!req.app.locals.initialized) {
    // Configure SendGrid API client
    SendGrid.setApiKey(env.SENDGRID_API_KEY);

    // Configure Firebase Admin SDK
    if (getApps().length === 0) {
      initializeApp({ projectId: env.GOOGLE_CLOUD_PROJECT });
    }

    req.app.locals.initialized = true;
  }

  next();
});

// Enable body parsing middleware
// http://expressjs.com/en/api.html#express.json
api.use(express.json({ limit: "1024mb" }));

// Authentication middleware
api.use(session);

// GraphQL API middleware
api.use("/api", handleGraphQL);

api.get("/", (req, res) => {
  res.render("home");
});

api.get("/favicon.ico", function (req, res) {
  res.redirect("https://nodejs.org/static/images/favicons/favicon.ico");
});

api.get("*", function () {
  throw new NotFound();
});

api.use(handleError);

export { api, db, env, updateSchema };
