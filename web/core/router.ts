/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { fetchQuery } from "react-relay/hooks";

import routes from "../routes";
import { NotFoundError } from "./errors";
import type { RouterContext, RouterResponse, Route } from "./router.types";

export async function resolveRoute(
  ctx: RouterContext,
): Promise<RouterResponse> {
  try {
    // Find the first route matching the provided URL path string
    for (let i = 0, route; i < routes.length, (route = routes[i]); i++) {
      if (route.path !== ctx.path) continue;

      let { variables } = route;

      // Prepare GraphQL query variables
      variables = typeof variables === "function" ? variables(ctx) : variables;

      // Fetch GraphQL query response and load React component in parallel
      const [component, data] = await Promise.all([
        route.component?.().then((x) => x.default),
        route.query &&
          fetchQuery(ctx.relay, route.query, variables, {
            fetchPolicy: "store-or-network",
          }).toPromise(),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { component, ...route.response(data as any, ctx) };
    }

    throw new NotFoundError();
  } catch (error) {
    return {
      title:
        error instanceof NotFoundError ? "Page not found" : "Application error",
      error,
    };
  }
}

export type { RouterContext, RouterResponse as RouteResponse, Route };
