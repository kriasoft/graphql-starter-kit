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
    presets: [
      require.resolve("next/babel"),
      [
        require.resolve("@emotion/babel-preset-css-prop"),
        { sourceMap: api.env() !== "production" },
      ],
    ],
    plugins: [require.resolve("babel-plugin-relay")],
  };
};
