/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import {
  match as createMatchFn,
  type Match,
  type MatchFunction,
} from "path-to-regexp";
import { fetchQuery } from "react-relay";
import { getRequest } from "relay-runtime";
import routes from "../routes";
import { getCurrentUser } from "./Auth";
import { ForbiddenError, NotFoundError } from "./errors";
import {
  type Route,
  type RouterContext,
  type RouterResponse,
} from "./router.types";

/**
 * Converts the URL path string to a RegExp matching function.
 *
 * @see https://github.com/pillarjs/path-to-regexp
 */
const matchUrlPath: (
  pattern: string[] | string,
  path: string,
) => Match<{ [key: string]: string }> = (() => {
  const cache = new Map<string, MatchFunction<{ [key: string]: string }>>();
  return function matchUrlPath(pattern: string[] | string, path: string) {
    const key = Array.isArray(pattern) ? pattern.join("::") : pattern;
    let fn = cache.get(key);
    if (fn) return fn(path);
    fn = createMatchFn(pattern, { decode: decodeURIComponent });
    cache.set(key, fn);
    return fn(path);
  };
})();

async function resolveRoute(ctx: RouterContext): Promise<RouterResponse> {
  try {
    // Find the first route matching the provided URL path string
    for (let i = 0, route; i < routes.length, (route = routes[i]); i++) {
      const match = matchUrlPath(route.path, ctx.path);

      if (!match) continue;

      ctx.params = match.params;

      // Prepare GraphQL query variables
      const variables =
        typeof route.variables === "function"
          ? route.variables(ctx)
          : route.variables
          ? route.variables
          : Object.keys(match.params).length === 0
          ? {}
          : match.params;

      // If `auth` variable is present in the route's GraphQL query
      // and the user's authentication state is not known yet, set it to true.
      if (route.query) {
        const { operation } = getRequest(route.query);
        if (operation.argumentDefinitions.some((x) => x.name === "auth")) {
          variables.auth = getCurrentUser(ctx.relay) === undefined;
        }
      }

      // Fetch GraphQL query response and load React component in parallel
      const [component, data] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        route.component?.().then((x: any) => x.default),
        route.query &&
          fetchQuery(ctx.relay, route.query, variables, {
            fetchPolicy: "store-or-network",
          }).toPromise(),
      ]);

      // Check if the route requires an authenticated user
      if (route.authorize) {
        const user = getCurrentUser(ctx.relay);
        if (
          !user ||
          (typeof route.authorize === "function" && !route.authorize(user))
        ) {
          throw new ForbiddenError();
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = route.response(data as any, ctx);

      if (response) return { component, ...response };
    }

    throw new NotFoundError();
  } catch (err) {
    return {
      title:
        err instanceof NotFoundError ? "Page not found" : "Application error",
      error: err as Error,
    };
  }
}

export {
  resolveRoute,
  type Route,
  type RouterContext,
  type RouterResponse as RouteResponse,
};
