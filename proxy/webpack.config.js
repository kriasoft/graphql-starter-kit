/**
 * Webpack configuration
 *
 * @see https://webpack.js.org/configuration/
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const env = require("env");
const path = require("path");
const { DefinePlugin } = require("webpack");
const pkg = require("./package.json");

/**
 * @param {Record<string, boolean> | undefined} envName
 * @param {{ mode: "production" | "development" }} options
 * @returns {import("webpack").Configuration}
 */
module.exports = function config(envName, options) {
  const isEnvProduction = options.mode === "production";
  const isEnvDevelopment = options.mode === "development";

  const prodEnv = env.load("prod");
  const testEnv = env.load("test");
  const devEnv = env.load("dev");

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

    resolve: {
      extensions: [".ts"],
    },

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
            cacheDirectory: `../.cache/${pkg.name}.babel-loader`,
            cacheCompression: true,
          },
        },
      ],
    },

    plugins: [
      new DefinePlugin({
        GOOGLE_CLOUD_REGION: JSON.stringify(prodEnv.GOOGLE_CLOUD_REGION),
        GOOGLE_CLOUD_PROJECT: JSON.stringify({
          prod: prodEnv.GOOGLE_CLOUD_PROJECT,
          test: testEnv.GOOGLE_CLOUD_PROJECT,
          dev: devEnv.GOOGLE_CLOUD_PROJECT,
        }),
      }),
    ],
  };
};
