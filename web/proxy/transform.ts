/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import type { Environment } from "relay-runtime";
import type { RouteResponse } from "../core/router";

/**
 * Injects HTML page metadata (title, description, etc.) as well as
 * the serialized Relay store.
 */
export function transform(
  res: Response,
  route: RouteResponse,
  relay: Environment,
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
    .transform(res);
}
