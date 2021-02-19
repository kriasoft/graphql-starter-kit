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
        if (route.head?.title) {
          el.setInnerContent(route.head.title);
        }
      },
    })
    .on('meta[name="description"]:first-of-type', {
      // <meta name="description" content="..." />
      element(el) {
        if (route.head?.description) {
          el.setAttribute("content", route.head.description);
        }
      },
    })
    .transform(res);
}
