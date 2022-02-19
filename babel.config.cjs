/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Babel configuration
 *
 * @see https://babeljs.io/docs/en/options
 * @param {import("@babel/core").ConfigAPI} api
 * @returns {import("@babel/core").TransformOptions}
 */
module.exports = function config(api) {
  const isNodeEnv = api.caller((caller) =>
    [
      "babel-jest",
      "@babel/register",
      "@babel/cli",
      "@babel/node",
      "@rollup/plugin-babel",
    ].includes(caller?.name || ""),
  );

  return {
    presets: [
      [
        "@babel/preset-env",
        isNodeEnv ? { targets: { node: "16", esmodules: false } } : {},
      ],
    ],

    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-object-rest-spread",
      "babel-plugin-relay",
      [
        "babel-plugin-import",
        {
          libraryName: "lodash",
          libraryDirectory: "",
          camel2DashComponentName: false,
        },
        "lodash",
      ],
    ],

    ignore: api.env() === "test" ? [] : ["**/__tests__/**", "**/*.test.ts"],
    sourceMaps: api.env() === "production",

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
