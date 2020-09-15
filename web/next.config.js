/**
 * Next.js configuration
 *
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

module.exports = {
  rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:8080/auth/:path*",
      },
      {
        source: "/graphql",
        destination: "http://localhost:8080/graphql",
      },
    ];
  },
};
