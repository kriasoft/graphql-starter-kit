/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "../core/app.js";

export const handler = app.get("/echo", ({ json, req, env }) => {
  return json({
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    cf: req.raw.cf,
    env: {
      APP_ENV: env.APP_ENV,
      APP_NAME: env.APP_NAME,
      APP_HOSTNAME: env.APP_HOSTNAME,
      APP_BUCKET: env.APP_BUCKET,
      API_ORIGIN: env.API_ORIGIN,
      GOOGLE_CLOUD_PROJECT: env.GOOGLE_CLOUD_PROJECT,
    },
  });
});

export type EchoHandler = typeof handler;
