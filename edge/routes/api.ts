/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "../core/app";

// Rewrite requests to a Google Cloud Function serving GraphQL API
// https://example.com/api => https://api-5oemu2yxnw-uc.a.run.app/api
app.all("/api", async ({ req, env }) => {
  const { pathname, search } = new URL(req.url);
  return await fetch(`${env.API_ORIGIN}${pathname}${search}`, req);
});

// Also, handle all the nested routes
app.all("/api/*", async ({ req, env }) => {
  const { pathname, search } = new URL(req.url);
  return await fetch(`${env.API_ORIGIN}${pathname}${search}`, req);
});
