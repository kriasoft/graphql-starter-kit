/**
 * Cloudflare Worker script acting as a reverse proxy.
 *
 * @see https://developers.cloudflare.com/workers/
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import { createRelay } from "../core/relay";
import { resolveRoute } from "../core/router";
import { parseHostname } from "./parse";
import { transform } from "./transform";

async function handleEvent(event: FetchEvent) {
  const request = event.request;
  const url = new URL(event.request.url);
  const { pathname: path, hostname } = url;
  const [env, prNumber] = parseHostname(hostname);

  // API endpoint URL
  const apiUrl = {
    hostname: `${GOOGLE_CLOUD_REGION}-${GOOGLE_CLOUD_PROJECT[env]}.cloudfunctions.net`,
    pathname: prNumber ? `/api_${prNumber}` : "/api",
  };

  // Serve static assets from KV storage
  // https://github.com/cloudflare/kv-asset-handler
  if (
    path.startsWith("/static/") ||
    path.startsWith("/favicon.") ||
    path.startsWith("/logo") ||
    path.startsWith("/manifest.") ||
    path.startsWith("/robots.")
  ) {
    try {
      return getAssetFromKV(event, {
        cacheControl: { bypassCache: env !== "prod" },
      });
    } catch (err) {
      console.error(err);
    }
  }

  // GraphQL API and authentication
  if (path.startsWith("/graphql") || path.startsWith("/auth")) {
    url.hostname = apiUrl.hostname;
    url.pathname = `${apiUrl.pathname}${path}`;
    return fetch(new Request(url.toString(), request));
  }

  // Image resizing
  if (path.startsWith("/img/")) {
    url.hostname = apiUrl.hostname;
    url.pathname = `/img${path.substring(4)}`;
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

  // Fetch index.html page from KV storage
  url.pathname = "/index.html";
  const resPromise = getAssetFromKV(
    { ...event, request: new Request(url.toString(), request) },
    { cacheControl: { bypassCache: env !== "prod" } },
  );

  // Find application route matching the URL pathname
  const apiBaseUrl = `https://${apiUrl.hostname}${apiUrl.pathname}`;
  const relay = createRelay({ baseUrl: apiBaseUrl, request });
  const route = await resolveRoute({ path, relay });

  if (route.redirect) {
    return Response.redirect(route.redirect, route.status);
  }

  // Inject page metadata such as <title>, <meta name="description" contents="..." />, etc.
  // and serialized API response <script id="data" type="application/json">...</script>
  // https://developer.mozilla.org/docs/Web/HTML/Element/script#embedding_data_in_html
  const res = transform(await resPromise, route, relay);
  return new Response(res.body, {
    status: route.error?.status || 200,
    headers: res.headers,
  });
}

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});

export {};
