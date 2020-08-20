/**
 * Webpack configuration
 *
 * @see https://webpack.js.org/configuration/
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const path = require("path");

/**
 * @param {Record<string, boolean> | undefined} env
 * @param {{ mode: 'production' | 'development' }} options
 * @returns {import('webpack').Configuration}
 */
module.exports = function config(env, options) {
  const isEnvProduction = options.mode === "production";
  const isEnvDevelopment = options.mode === "development";

  process.env.BABEL_ENV = options.mode;

  return {
    mode: options.mode,
    target: "webworker",
    bail: isEnvProduction,

    entry: "./src/main.ts",

    output: {
      path: isEnvProduction ? path.resolve(__dirname, "dist") : undefined,
      pathinfo: isEnvDevelopment,
      filename: "[name].js",
    },

    devtool: "source-map",

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
            cacheDirectory: true,
            cacheCompression: true,
          },
        },
      ],
    },
  };
};
