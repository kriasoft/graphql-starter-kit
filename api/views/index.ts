/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Express } from "express";
import { engine } from "express-handlebars";

/**
 * Configure Handlebars as the default Express.js view engine.
 *
 * @see https://handlebarsjs.com/
 * @see https://www.npmjs.com/package/express-handlebars
 */
export function withViews<T extends Express>(app: T): T {
  app.engine(".hbs", engine({ extname: ".hbs", helpers: { json } }));
  app.set("view engine", ".hbs");
  return app;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Safely serialize an object into a JSON string. Usage example:
 *
 * <script id="data" type="application/json">{{{json data}}}</script>
 */
function json(value: any): string {
  return JSON.stringify(value).replace(/<\/script/gi, "</\\u0073cript");
}
