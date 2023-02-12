/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Hono } from "hono";
import * as Altair from "./altair.js";

/**
 * Application router for Cloudflare Workers
 * @see https://honojs.dev/
 */
const app = new Hono();

app.use("*", async function (ctx, next) {
  const { hostname } = new URL(ctx.req.url);

  // Resolve the review deployment version (PR number), for example:
  //   `https://example.com` => null
  //   `https://123.example.com` => 123
  const prNumber = hostname.match(/^(\d+)\./)?.[1] ?? null;

  if (prNumber) {
    const domain = hostname.replace(/^\w+\./, "");
    ctx.env.APP_HOSTNAME = hostname;
    ctx.env.APP_BUCKET = `preview.${domain}/${prNumber}`;

    if (!ctx.env.API_ORIGIN.startsWith(`https://api-${prNumber}-`)) {
      ctx.env.API_ORIGIN = ctx.env.API_ORIGIN.replace(
        "https://api-",
        `https://api-${prNumber}-`,
      );
    }
  } else {
    ctx.env.APP_BUCKET = hostname;
  }

  await next();
});

app.get("/echo", (ctx) => {
  const { req, env } = ctx;
  const url = new URL(req.url);

  return ctx.json({
    url: {
      href: url.href,
      origin: url.origin,
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      searchParams: Object.fromEntries(url.searchParams),
    },
    env: {
      APP_ENV: env.APP_ENV,
      APP_NAME: env.APP_NAME,
      APP_HOSTNAME: env.APP_HOSTNAME,
      APP_BUCKET: env.APP_BUCKET,
      API_ORIGIN: env.API_ORIGIN,
      GOOGLE_CLOUD_PROJECT: env.GOOGLE_CLOUD_PROJECT,
    },
    headers: Object.fromEntries(req.headers.entries()),
    cf: req.cf,
  });
});

app.all("/__/*", async ({ req, env }) => {
  const url = new URL(req.url);
  url.hostname = `${env.GOOGLE_CLOUD_PROJECT}.firebaseapp.com`;
  return await fetch(url.toString(), req);
});

// Block all web crawlers from non-production deployments
// https://moz.com/learn/seo/robotstxt
app.get("/robots.txt", function (ctx) {
  return ctx.env.APP_ENV === "prod"
    ? fetch(ctx.req.url, ctx.req)
    : ctx.text("User-agent: *\nDisallow: /\n");
});

// Rewrite requests to a Google Cloud Function serving GraphQL API
// https://example.com/api => https://api-5oemu2yxnw-uc.a.run.app/api
app.all("/api", async ({ req, env }) => {
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

  return Altair.transform(res, env as Env);
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

// Serve the main app assets from a Google Storage Bucket (GCS)
// for the target environment, e.g. gs://example.com/
app.all("*", async ({ req, env }) => {
  const url = new URL(req.url);

  // Append URL path prefix (GCS bucket) and suffix (index.html)
  if (
    url.pathname.startsWith("/assets/") ||
    /\.(manifest|json|txt|html|js|ico|png|jpg|jpeg|gif)$/.test(url.pathname)
  ) {
    url.hostname = "storage.googleapis.com";
    url.pathname = `/${env.APP_BUCKET}${url.pathname}`;
  } else {
    url.hostname = "storage.googleapis.com";
    url.pathname = `/${env.APP_BUCKET}/index.html`;
  }

  return await fetch(url.toString(), req);
});

export default app;
