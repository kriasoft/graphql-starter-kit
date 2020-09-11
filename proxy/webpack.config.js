/**
 * Webpack configuration
 *
 * @see https://webpack.js.org/configuration/
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const path = require("path");
const pkg = require("./package.json");

/**
 * @param {Record<string, boolean> | undefined} env
 * @param {{ mode: "production" | "development" }} options
 * @returns {import("webpack").Configuration}
 */
module.exports = function config(env, options) {
  const isEnvProduction = options.mode === "production";
  const isEnvDevelopment = options.mode === "development";

  process.env.BABEL_ENV = options.mode;

  return {
    mode: options.mode,
    target: "webworker",
    bail: isEnvProduction,

    entry: "./main.ts",

    output: {
      path: path.resolve(__dirname, "../dist"),
      pathinfo: isEnvDevelopment,
      filename: `${pkg.name}.js`,
    },

    devtool: "inline-source-map",

    optimization: {
      minimize: isEnvProduction,
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            rootMode: "upward",
            cacheDirectory: path.resolve(
              __dirname,
              `../.cache/${pkg.name}.babel-loader`,
            ),
            cacheCompression: true,
          },
        },
      ],
    },
  };
};
