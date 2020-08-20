/**
 * Cloudflare Worker
 *
 * @see https://developers.cloudflare.com/workers/
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request) {
  const url = new URL(request.url);
  const { pathname: path } = url;
  const project = "example";

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

  // GraphQL API and authentication
  if (path.startsWith("/graphql") || path.startsWith("/auth")) {
    url.hostname = `us-central1-${project}.cloudfunctions.net`;
    url.pathname = `/api${path}`;
    return fetch(new Request(url.toString(), request));
  }

  // TODO: Web app
  return new Response(`Hello from ${url.pathname}!`);
}
