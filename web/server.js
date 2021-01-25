/**
 * Customized Next.js server.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-server
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const setup = app.prepare().then(() => {
  if (dev) {
    const server = require("express")();
    const port = process.env.PORT || 3000;

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

    server.all("*", (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) throw err;
      process.stdout.write(`[web] http://localhost:${port} `);
      console.log({ dev });
    });
  }
});

// Google Cloud function
// https://cloud.google.com/functions/docs/writing
module.exports.web = function web(req, res) {
  setup
    .then(() => handle(req, res))
    .catch((err) => {
      res.status(err.code || 500);
      res.type("text/plain");
      res.send(err.message);
    });
};
