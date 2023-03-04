/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as Altair from "../core/altair.js";
import { app } from "../core/app.js";

// Rewrite requests to a Google Cloud Function serving GraphQL API
// https://example.com/api => https://api-5oemu2yxnw-uc.a.run.app/api
export const handler = app.all("/api", async ({ req, env }) => {
  const url = new URL(req.url);
  const api = new URL(env.API_ORIGIN);

  if (req.method !== "GET") {
    url.hostname = api.hostname;
    return await fetch(url.toString(), req);
  }

  url.hostname = "cdn.jsdelivr.net";
  url.pathname = "/npm/altair-static/build/dist/index.html";

  let res = await fetch(url.toString(), req);
  res = new Response(res.body, res);
  res.headers.set("Content-Type", "text/html; charset=utf-8");
  res.headers.set("Cache-Control", "public, max-age=604800, must-revalidate");

  return Altair.transform(res, env);
});

app.all("/api/*", async ({ req }) => {
  const url = new URL(req.url);

  url.hostname = "cdn.jsdelivr.net";
  url.pathname = `/npm/altair-static/build/dist${url.pathname.substring(4)}`;

  let res = await fetch(url.toString(), req);
  res = new Response(res.body, res);
  res.headers.set("Cache-Control", "public, max-age=604800, must-revalidate");
  return res;
});

export type LoginHandler = typeof handler;
export type LoginResponse = {
  email: string;
};
