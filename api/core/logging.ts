/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type Request, type Response } from "express";
import { type GraphQLParams } from "graphql-helix";
import { HttpError } from "http-errors";
import PrettyError from "pretty-error";
import env from "../env";

// https://github.com/AriaMinaei/pretty-error#readme
const pe = new PrettyError();

pe.skipNodeFiles();
pe.skipPackage("express");

export type LogSeverity =
  | "DEFAULT"
  | "DEBUG"
  | "INFO"
  | "NOTICE"
  | "WARNING"
  | "ERROR"
  | "CRITICAL"
  | "ALERT"
  | "EMERGENCY";

/**
 * Write log messages alongside the required metadata to stdin/stdout.
 *
 * @see https://cloud.google.com/functions/docs/monitoring/logging
 */
export function log(
  req: Request,
  res: Response,
  severity: LogSeverity,
  data: string | Record<string, unknown> | Error | HttpError,
  context?: GraphQLParams | Record<string, unknown>,
) {
  if (env.isProduction) {
    const traceId = req.get("x-cloud-trace-context")?.split("/")?.[0] as string;
    const message = JSON.stringify({
      severity,
      httpRequest: {
        requestMethod: req.method,
        requestUrl: `${req.protocol}://${req.get("host")}/${req.originalUrl}`,
        userAgent: req.get("user-agent"),
        referrer: req.headers.referer,
        responseStatusCode: res.headersSent
          ? res.statusCode
          : (data as { statusCode: number }).statusCode ?? undefined,
        remoteIp: req.ip,
      },
      "logging.googleapis.com/trace": `projects/${env.GOOGLE_CLOUD_PROJECT}/traces/${traceId}`,
      ...(typeof data === "string"
        ? { message: data }
        : data instanceof Error
        ? { message: data.stack }
        : data),
      context,
    });

    console.log(message);
  } else {
    if (data instanceof Error || data instanceof HttpError) {
      console.error(pe.render(data));
    } else {
      console.log(severity, data, context);
    }
  }
}
