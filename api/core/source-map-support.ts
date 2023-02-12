/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import * as SourceMapSupport from "source-map-support";

const prefixURL = `${pathToFileURL(process.cwd())}/`;

/**
 * Enables source map support
 * https://github.com/evanw/node-source-map-support#readme
 */
SourceMapSupport.install({
  retrieveSourceMap(file) {
    if (file.startsWith(prefixURL) && file.endsWith(".js")) {
      return {
        url: file.substring(prefixURL.length),
        map: readFileSync(`${file.substring(prefixURL.length)}.map`, "utf-8"),
      };
    }

    return null;
  },
});
