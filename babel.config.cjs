/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

/**
 * Babel configuration.
 *
 * @see https://babeljs.io/docs/en/options
 * @param {import("@babel/core").ConfigAPI} api
 * @returns {import("@babel/core").TransformOptions}
 */
module.exports = function config(api) {
  api.cache.using(() => process.env.NODE_ENV);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: process.env.NODE_ENV === "test" ? "auto" : false,
          targets: { node: "current" },
        },
      ],
    ],

    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-object-rest-spread",
    ],

    overrides: [
      {
        test: /\.tsx?$/,
        presets: ["@babel/preset-typescript"],
        plugins: [
          process.env.NODE_ENV === "test" && [
            "replace-import-extension",
            { extMapping: { ".js": ".ts" } },
          ],
        ].filter(Boolean),
      },
      {
        test: /\.tsx$/,
        presets: [
          [
            "@babel/preset-react",
            {
              development: process.env.NODE_ENV === "development",
              useBuiltIns: true,
              runtime: "automatic",
              importSource: "@emotion/react",
            },
          ],
        ],
        plugins: ["@emotion/babel-plugin"],
      },
      {
        test: "**/*.d.ts",
        presets: [["@babel/preset-env", { targets: { esmodules: true } }]],
      },
    ],
  };
};
