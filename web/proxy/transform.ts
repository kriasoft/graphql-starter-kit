/**
 * Injects HTML page metadata (title, description, etc.)
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import type { Environment } from "relay-runtime";
import type { RouteResponse } from "../core/router";

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
        el.setInnerContent(
          JSON.stringify(relay.getStore().getSource().toJSON()),
        );
      },
    })
    .transform(res);
}
