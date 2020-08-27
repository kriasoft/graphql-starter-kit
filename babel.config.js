/**
 * Babel configuration
 *
 * @see https://babeljs.io/docs/en/options
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 *
 * @param {import("@babel/core").ConfigAPI} api
 * @returns {import("@babel/core").TransformOptions}
 */

module.exports = function config(api) {
  return {
    presets: ["@babel/preset-env"],

    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-object-rest-spread",
    ],

    ignore: api.env() === "test" ? [] : ["**/__tests__/**", "**/*.test.ts"],

    overrides: [
      {
        test: /\.tsx?$/,
        presets: ["@babel/preset-typescript"],
      },

      /**
       * Google Cloud Functions
       * https://cloud.google.com/functions/docs/concepts/nodejs-runtime
       */
      {
        test: "api/src/**/*.ts",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: { node: "12" },
              useBuiltIns: "usage",
              corejs: { version: 3, proposals: true },
            },
          ],
        ],
        env: {
          production: {
            sourceMaps: true,
          },
        },
      },

      /**
       * Cloudflare Workers
       */
      {
        test: "proxy/src/**/*.ts",
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
              loose: true,
              targets: {
                browsers: "last 1 Chrome versions",
              },
              useBuiltIns: "usage",
              corejs: { version: 3, proposals: true },
            },
          ],
        ],
        env: {
          production: {
            sourceMaps: "inline",
          },
        },
      },
    ],
  };
};
