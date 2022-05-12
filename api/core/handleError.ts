/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { ErrorRequestHandler } from "express";
import { RequestError } from "got";
import { isHttpError } from "http-errors";
import { log } from "./logging";

/**
 * Renders an error page.
 */
export const handleError: ErrorRequestHandler = function (
  err,
  req,
  res,
  next, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  log(req, "ERROR", err);

  let statusCode = 500;

  if (err instanceof RequestError && err.response?.statusCode) {
    statusCode = err.response.statusCode;
  } else if (isHttpError(err)) {
    statusCode = err.statusCode ?? 400;
  }

  res.status(statusCode);

  if (
    /application\/json/.test(req.get("accept") ?? "") ||
    req.path.startsWith("/api/")
  ) {
    res.send(err instanceof RequestError ? { message: err.message } : err);
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
