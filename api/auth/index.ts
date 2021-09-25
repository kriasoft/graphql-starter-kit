/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { ErrorRequestHandler, Router } from "express";
import env from "../env";
import * as facebook from "./facebook";
import * as google from "./google";
import session from "./session";

const auth = Router();

auth.use(session);

auth.use("/auth", function (req, res, next) {
  // Ensure that OAuth 2.0 redirect URI will work from behind a proxy
  const [, provider] = req.path.split("/");
  const origin =
    req.get("origin") ||
    (env.isProduction
      ? env.APP_ORIGIN
      : `${req.protocol}://${req.get("host")}`);
  req.app.locals.redirect_uri = `${origin}/auth/${provider}/return`;
  // Disable cache for authentication requests
  res.setHeader("Cache-Control", "no-store");
  next();
});

auth.get("/auth/facebook", facebook.redirect);
auth.get("/auth/facebook/return", facebook.callback);

auth.get("/auth/google", google.redirect);
auth.get("/auth/google/return", google.callback);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
auth.use(function handleError(error, req, res, next) {
  console.warn(error);
  res.render("auth-callback", { error, data: null, layout: false });
} as ErrorRequestHandler);

export { auth };
