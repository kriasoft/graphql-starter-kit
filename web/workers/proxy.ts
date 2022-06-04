/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import { createRelay, resolveRoute } from "../core";
import { transform } from "./transform";

/**
 * Cloudflare Worker script acting as a reverse proxy.
 *
 * @see https://developers.cloudflare.com/workers/
 */
async function handleEvent(event: FetchEvent) {
  const req = event.request;
  const url = new URL(req.url);
  const { pathname: path } = url;
  const cf = (req as CfRequestInit).cf as
    | IncomingRequestCfProperties
    | undefined;
  const api = new URL(API_ORIGIN);

  // Restrict access to crawlers for non-production deployments
  if (path === "/robots.txt" && APP_ENV !== "prod") {
    return new Response(`User-agent: *\nDisallow: /\n`, { status: 200 });
  }

  // GraphQL API and authentication
  if (
    path === "/api" ||
    path.startsWith("/api/") ||
    path.startsWith("/auth/")
  ) {
    url.hostname = api.hostname;
    return fetch(
      url.toString(),
      new Request(req, {
        headers: {
          ...Object.fromEntries(req.headers.entries()),
          ...(cf?.continent && { "x-continent": cf.continent }),
          ...(cf?.country && { "x-country": cf.country }),
          ...(cf?.timezone && { "x-timezone": cf.timezone }),
        },
      }),
    );
  }

  // Image resizing
  // https://github.com/kriasoft/image-resizing
  if (path.startsWith("/img/")) {
    url.hostname = api.hostname;
    return fetch(url.toString(), req);
  }

  // Serve static assets from KV storage
  // https://github.com/cloudflare/kv-asset-handler
  if (
    path.startsWith("/static/") ||
    path.match(/\.(ico|json|png|jpg|jpeg|gif|text)$/)
  ) {
    return getAssetFromKV(event);
  }

  // Fetch index.html page from KV storage
  url.pathname = "/index.html";
  const resPromise = getAssetFromKV(
    {
      request: new Request(url.toString(), req),
      waitUntil(promise) {
        return event.waitUntil(promise);
      },
    },
    { cacheControl: { bypassCache: true } },
  );

  // Find application route matching the URL pathname
  const relay = createRelay({ baseUrl: API_ORIGIN, request: req });
  const route = await resolveRoute({ path, query: url.searchParams, relay });

  if (route.redirect) {
    const redirectURL = new URL(route.redirect, url.toString());
    return Response.redirect(redirectURL.toString(), route.status ?? 302);
  }

  if (route.error) {
    relay.commitUpdate(function (store) {
      const root = store.getRoot();
      root.setValue(route.error?.stack, "error");
    });
  }

  // Inject page metadata such as <title>, <meta name="description" contents="..." />, etc.
  // and serialized API response <script id="data" type="application/json">...</script>
  // https://developer.mozilla.org/docs/Web/HTML/Element/script#embedding_data_in_html
  const res = transform(await resPromise, route, relay);
  return new Response(res.body, {
    status: (route.error as unknown as { status: number })?.status || 200,
    headers: res.headers,
  });
}

addEventListener("fetch", function (event: FetchEvent) {
  event.respondWith(handleEvent(event));
});
