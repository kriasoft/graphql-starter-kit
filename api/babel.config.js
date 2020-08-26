/**
 * Babel configuration
 *
 * @see https://babeljs.io/docs/en/options
 * @see https://babeljs.io/docs/en/babel-preset-typescript
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 *
 * @type {import("@babel/core").TransformOptions}
 */

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      /** @lends {import("@babel/preset-env").Options} */ {
        // https://cloud.google.com/functions/docs/concepts/nodejs-runtime
        targets: { node: "12" },
        useBuiltIns: "usage",
        corejs: { version: 3, proposals: true },
      },
    ],
    "@babel/preset-typescript",
  ],

  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "babel-plugin-idx",
  ],

  env: {
    development: {
      ignore: ["**/__tests__/**", "**/*.test.ts"],
    },
    production: {
      ignore: ["**/__tests__/**", "**/*.test.ts"],
    },
  },

  sourceMaps: "inline",
};
