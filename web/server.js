/**
 * Customized Next.js server.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-server
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const next = require("next");
const express = require("express");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Enable GraphQL API and authentication proxy in development mode
  if (dev) {
    const { createProxyMiddleware } = require("http-proxy-middleware");

    server.use(
      createProxyMiddleware(["/auth", "/graphql"], {
        target: "http://localhost:8080",
        changeOrigin: true,
        onProxyReq(proxyReq) {
          proxyReq.setHeader("host", `localhost:${port}`);
        },
      }),
    );
  }

  server.all("*", (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    process.stdout.write(`[web] http://localhost:${port} `);
    console.log({ dev });
  });
});
