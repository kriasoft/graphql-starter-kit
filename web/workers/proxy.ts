/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import * as configs from "../config";
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
  /* @ts-expect-error "123-test" => "test" */
  const config = configs[APP_ENV.replace(/^\d+-/, "")];
  const api = new URL(API_URL);

  // Serve static assets from KV storage
  // https://github.com/cloudflare/kv-asset-handler
  if (
    path.startsWith("/static/") ||
    path.startsWith("/favicon.") ||
    path.startsWith("/logo") ||
    path.startsWith("/manifest.") ||
    path.startsWith("/robots.") ||
    path.endsWith(".png")
  ) {
    try {
      return getAssetFromKV(event, {
        cacheControl: { bypassCache: config.app.env !== "prod" },
      });
    } catch (err) {
      console.error(err);
    }
  }

  // GraphQL API and authentication
  if (
    path === "/api" ||
    path.startsWith("/api/") ||
    path.startsWith("/auth/")
  ) {
    url.hostname = api.hostname;
    return fetch(new Request(url.toString(), req));
  }

  // Image resizing
  if (path.startsWith("/img/")) {
    url.hostname = api.hostname;
    return fetch(new Request(url.toString(), req));
  }

  // Fetch index.html page from KV storage
  url.pathname = "/index.html";
  const resPromise = getAssetFromKV(
    { ...event, request: new Request(url.toString(), req) },
    { cacheControl: { bypassCache: config.app.env !== "prod" } },
  );

  // Find application route matching the URL pathname
  const apiBaseUrl = API_URL;
  const relay = createRelay({ baseUrl: apiBaseUrl, request: req });
  const route = await resolveRoute({ path, relay });

  if (route.redirect) {
    return Response.redirect(route.redirect, route.status);
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
  const res = transform(await resPromise, route, relay, config);
  return new Response(res.body, {
    status: (route.error as unknown as { status: number })?.status || 200,
    headers: res.headers,
  });
}

addEventListener("fetch", function (event: FetchEvent) {
  event.respondWith(handleEvent(event));
});
