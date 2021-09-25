/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import type { Environment } from "relay-runtime";
import type { Config } from "../config";
import type { RouteResponse } from "../core/router";

/**
 * Injects HTML page metadata (title, description, etc.) as well as
 * the serialized Relay store.
 */
export function transform(
  res: Response,
  route: RouteResponse,
  relay: Environment,
  config: Config,
): Response {
  return new HTMLRewriter()
    .on("title:first-of-type", {
      // <title>...</title>
      element(el) {
        if (route.title) {
          el.setInnerContent(route.title);
        }
      },
    })
    .on('meta[name="description"]:first-of-type', {
      // <meta name="description" content="..." />
      element(el) {
        if (route.description) {
          el.setAttribute("content", route.description);
        }
      },
    })
    .on("script#data", {
      element(el) {
        // <script id="data" type="application/json"></script>
        // https://developer.mozilla.org/docs/Web/HTML/Element/script#embedding_data_in_html
        const data = relay.getStore().getSource().toJSON();
        const json = JSON.stringify(data).replace(
          /<\/script/g,
          "</\\u0073cript",
        );
        el.setInnerContent(json, { html: true });
      },
    })
    .on("script#config", {
      element(el) {
        // <script id="config" type="application/json"></script>
        // https://developer.mozilla.org/docs/Web/HTML/Element/script#embedding_data_in_html
        el.setInnerContent(
          JSON.stringify({
            ...config,
            api: {
              ...config.api,
              origin: config.app.origin,
              prefix: "",
              path: "/api",
            },
          }),
          { html: true },
        );
      },
    })
    .transform(res);
}
