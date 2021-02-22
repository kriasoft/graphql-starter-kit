/**
 * Injects HTML page metadata (title, description, etc.)
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import type { RouteResponse } from "../core/router";

export function transform(route: RouteResponse, res: Response): Response {
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
    .transform(res);
}
