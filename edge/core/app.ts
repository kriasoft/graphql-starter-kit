/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Hono } from "hono";

/**
 * Application router for Cloudflare Workers
 * @see https://honojs.dev/
 */
export const app = new Hono<Env>();

// Configure environment variables for review deployments
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

// Block all web crawlers from non-production deployments
// https://moz.com/learn/seo/robotstxt
app.get("/robots.txt", function (ctx) {
  return ctx.env.APP_ENV === "prod"
    ? fetch(ctx.req.url, ctx.req)
    : ctx.text("User-agent: *\nDisallow: /\n");
});

app.onError((err, ctx) => {
  console.error(err.stack);
  return ctx.text(err.stack ?? "Application error", 500, {
    "Content-Type": "text/plain",
  });
});
