/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { ErrorRequestHandler } from "express";
import { isHttpError } from "http-errors";
import { reportError } from "./core";

/**
 * Renders an error page.
 */
export const handleError: ErrorRequestHandler = function (
  err,
  req,
  res,
  next, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  reportError(err, req);

  const statusCode = isHttpError(err) ? err.statusCode : 500;
  res.status(statusCode);

  if (/application\/json;/.test(req.get("accept") ?? "")) {
    res.send(err);
  } else if (statusCode === 404) {
    res.render("error", {
      title: "Page Not Found",
      message: "Sorry, but the page you were trying to view does not exist.",
      layout: false,
    });
  } else {
    res.render("error", {
      title: "Application Error",
      message: "An error occurred while processing this request.",
      stack: err.stack,
      layout: false,
    });
  }
};
