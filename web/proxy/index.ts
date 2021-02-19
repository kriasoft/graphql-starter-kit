/**
 * Cloudflare Worker script acting as a reverse proxy.
 *
 * @see https://developers.cloudflare.com/workers/
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { transform } from "./transform";
import { parseHostname } from "./parse";
import { createRelay } from "../core/relay";
import { resolveRoute } from "../core/router";

async function handleRequest(request: Request) {
  const url = new URL(request.url);
  const { pathname: path, hostname } = url;
  const [env, prNumber] = parseHostname(hostname);

  // API endpoint URL
  const apiUrl = {
    hostname: `${GOOGLE_CLOUD_REGION}-${GOOGLE_CLOUD_PROJECT[env]}.cloudfunctions.net`,
    pathname: prNumber ? `/api_${prNumber}` : "/api",
  };

  // GraphQL API and authentication
  if (path.startsWith("/graphql") || path.startsWith("/auth")) {
    url.hostname = apiUrl.hostname;
    url.pathname = `${apiUrl.pathname}${path}`;
    return fetch(new Request(url.toString(), request));
  }

  // TODO: Blog posts
  if (path === "/blog" || path.startsWith("/blog/")) {
    url.hostname = "example.webflow.io";
    return fetch(new Request(url.toString(), request));
  }

  // TODO: Help pages
  if (path === "/help" || path.startsWith("/help/")) {
    url.hostname = "intercom.help";
    url.pathname = "/example-xxx/en/" + path.substring(6);
    return fetch(new Request(url.toString(), request));
  }

  // Disallow search engin crawlers to access non-production areas
  if (path === "/robots.txt" && env !== "prod") {
    return new Response("User-agent: *\nDisallow: /");
  }

  url.protocol = "https:";
  url.hostname = STORAGE_BUCKET[env];
  url.pathname = `/app${path}`;

  const apiBaseUrl = `https://${apiUrl.hostname}${apiUrl.pathname}`;
  const resPromise = fetch(new Request(url.toString(), request));
  const relay = createRelay({ baseUrl: apiBaseUrl, request });
  const route = await resolveRoute({ path, relay });

  if (route.redirect) {
    return Response.redirect(route.redirect, route.status);
  }

  const res = transform(route, await resPromise);
  return new Response(res.body, {
    status: route.error?.status || 200,
    headers: res.headers,
  });
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

export {};
