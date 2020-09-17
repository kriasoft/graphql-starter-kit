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
  api.cache(true);

  return {
    presets: [
      "next/babel",
      "@emotion/babel-preset-css-prop",
      {
        sourceMap: api.env() !== "production",
      },
    ],
    plugins: ["relay"],
  };
};
