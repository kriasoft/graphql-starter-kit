/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Logging } from "@google-cloud/logging";
import { Request } from "express";
import type { GraphQLParams } from "express-graphql";
import PrettyError from "pretty-error";
import env from "../env";

// https://googleapis.dev/nodejs/logging/latest/
const logging = new Logging();
const log = logging.log("cloudfunctions.googleapis.com/cloud-functions");

// https://github.com/AriaMinaei/pretty-error#readme
const pe = new PrettyError();

/**
 * Logs application errors to Google StackDriver when in production,
 * otherwise just print them to the console using PrettyError formatter.
 */
export function reportError(
  err: Error,
  req: Request,
  context?: GraphQLParams | Record<string, unknown>,
): void {
  if (!env.isProduction) {
    console.error(pe.render(err));
    return;
  }

  // E.g. us-central-example.cloudfunctions.net
  const host = req.get("host") as string;

  // https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry
  log.error(
    log.entry(
      {
        resource: {
          type: "cloud_function",
          labels: {
            region: host.substring(0, host.indexOf("-", host.indexOf("-") + 1)),
            function_name: process.env.FUNCTION_TARGET as string,
          },
        },
        httpRequest: {
          requestMethod: req.method,
          requestUrl: req.originalUrl,
          userAgent: req.get("user-agent"),
          remoteIp: req.ip,
          referer: req.headers.referer,
          latency: null,
        },
        labels: {
          execution_id: req.get("function-execution-id") as string,
        },
      },
      {
        message: err.stack,
        context: {
          ...context,
          user: req.user
            ? { id: req.user.id, username: req.user.username }
            : null,
        },
      },
    ),
  );
}
