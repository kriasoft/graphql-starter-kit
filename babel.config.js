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
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      "@babel/plugin-proposal-object-rest-spread",
    ],

    ignore: api.env() === "test" ? [] : ["**/__tests__/**", "**/*.test.ts"],

    overrides: [
      {
        test: /\.tsx?$/,
        presets: ["@babel/preset-typescript"],
      },

      {
        test: /\.tsx$/,
        presets: [
          [
            "@babel/preset-react",
            {
              development: api.env() === "development",
              useBuiltIns: true,
            },
          ],
        ],
      },

      // Google Cloud Functions
      // https://cloud.google.com/functions/docs/concepts/nodejs-runtime
      {
        test: "api/**/*.ts",
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

      {
        test: "**/*.d.ts",
        presets: [["@babel/preset-env", { targets: { esmodules: true } }]],
      },

      // Cloudflare Workers
      {
        test: "proxy/**/*.ts",
        presets: [
          [
            "@babel/preset-env",
            {
              modules: api.env() === "test" ? "auto" : false,
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
