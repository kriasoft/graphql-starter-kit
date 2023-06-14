/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { getCookie } from "hono/cookie";
import { app } from "../core/app";
import snippet from "../views/landing.ejs";

// Serve landing pages
app.use("*", async (ctx, next) => {
  const url = new URL(ctx.req.url);

  if (!["/", "/about", "/home"].includes(url.pathname)) {
    return next();
  }

  // Indicates whether the user was previously authenticated
  const isAuthenticated = getCookie(ctx, "auth") === "1";

  // Do not serve the home landing page to authenticated users
  if (url.pathname === "/" && isAuthenticated) {
    return next();
  }

  const res = await fetch("https://example.framer.app/", ctx.req.raw);

  return new HTMLRewriter()
    .on("link", {
      element(el) {
        if (el.getAttribute("rel") === "icon") {
          el.setAttribute("href", "/favicon.ico");
        }
      },
    })
    .on("body", {
      element(el) {
        el.onEndTag((tag) => {
          try {
            tag.before(snippet(ctx.env), { html: true });
          } catch (err) {
            console.error(err);
          }
        });
      },
    })
    .transform(res.clone());
});
