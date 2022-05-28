/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Request } from "express";
import { RequestError } from "got";
import { GraphQLParams } from "graphql-helix";
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
  severity: LogSeverity,
  data: string | Record<string, unknown> | Error | HttpError,
  context?: GraphQLParams | Record<string, unknown>,
) {
  if (req.get("x-log-level") === "none") {
    return;
  }

  if (env.isProduction) {
    const traceId = req.get("x-cloud-trace-context")?.split("/")?.[0] as string;
    const message = {
      severity,
      "logging.googleapis.com/trace": `projects/${env.GOOGLE_CLOUD_PROJECT}/traces/${traceId}`,
    };

    // Logs the original HTTP request/response
    // https://github.com/sindresorhus/got#documentation
    if (data instanceof RequestError) {
      console.log(
        JSON.stringify({
          ...message,
          url: data.request?.requestUrl,
          code: data.code,
          statusCode: data.response?.statusCode,
          statusMessage: data.response?.statusMessage,
          ...context,
          ...((data.response?.body as string)?.startsWith("{")
            ? JSON.parse(data.response?.body as string)
            : { message: data.response?.body }),
        }),
      );
    }

    console.log(
      JSON.stringify({
        ...message,
        ...(typeof data === "string"
          ? { message: data }
          : data instanceof Error || typeof data.stack === "string"
          ? { message: (data.stack as string).replace(/\(file:\/\//g, "") }
          : data),
      }),
    );
  } else {
    if (data instanceof Error || data instanceof HttpError) {
      console.error(pe.render(data));
    } else {
      console.log(severity, data, context);
    }
  }
}
