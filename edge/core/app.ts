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
  const { hostname, pathname } = new URL(ctx.req.url);

  // Block all web crawlers from non-production deployments
  // https://moz.com/learn/seo/robotstxt
  if (
    pathname === "/robots.txt" &&
    ctx.env.APP_ENV !== "prod" &&
    ctx.req.method === "GET"
  ) {
    return ctx.text("User-agent: *\nDisallow: /\n");
  }

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

app.onError((err, ctx) => {
  console.error(err.stack);
  return ctx.text(err.stack ?? "Application error", 500, {
    "Content-Type": "text/plain",
  });
});
