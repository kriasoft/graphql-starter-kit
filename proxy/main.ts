/**
 * Cloudflare Worker
 *
 * @see https://developers.cloudflare.com/workers/
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { parseHostname } from "./parse";

async function handleRequest(request: Request) {
  const url = new URL(request.url);
  const { pathname: path, hostname } = url;
  const [env, ver] = parseHostname(hostname);

  // GraphQL API and authentication
  if (path.startsWith("/graphql") || path.startsWith("/auth")) {
    url.hostname = [
      `${GOOGLE_CLOUD_REGION}-`,
      `${GOOGLE_CLOUD_PROJECT[env]}${ver ? `_${ver}` : ""}`,
      ".cloudfunctions.net",
    ].join("");
    url.pathname = `${ver ? `/api_${ver}` : "/api"}${path}`;
    return fetch(new Request(url.toString(), request));
  }

  // Configure access to search engines
  // https://moz.com/learn/seo/robotstxt
  if (path === "/robots.txt") {
    return env === "prod"
      ? new Response("User-agent: *\nAllow: /")
      : new Response("User-agent: *\nDisallow: /");
  }

  // Landing pages and blog
  if (path === "/" || path.startsWith("/blog")) {
    url.hostname = "example.webflow.io";
    return fetch(new Request(url.toString(), request));
  }

  // Help pages
  if (path === "/help" || path.startsWith("/help")) {
    url.hostname = "intercom.help";
    url.pathname = "/example-xxx/en/" + path.substring(6);
    return fetch(new Request(url.toString(), request));
  }

  // TODO: Web app
  return new Response(`Hello from ${url.pathname}!`);
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
