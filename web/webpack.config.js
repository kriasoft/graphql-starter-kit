/**
 * Webpack configuration
 *
 * @see https://webpack.js.org/configuration/
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

const env = require("env");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const InlineChunkHtmlPlugin = require("inline-chunk-html-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { IgnoreAsyncImportsPlugin } = require("ignore-webpack-plugin");
const pkg = require("./package.json");

/**
 * @param {Record<string, boolean> | undefined} envName
 * @param {{ mode: "production" | "development" }} options
 * @returns {import("webpack").Configuration}
 */
module.exports = function config(envName, options) {
  const isEnvProduction = options.mode === "production";
  const isEnvDevelopment = options.mode === "development";
  const isDevServer = isEnvDevelopment && process.argv.includes("serve");
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes("--profile");

  const prodEnv = env.load("prod");
  const testEnv = env.load("test");
  const devEnv = env.load("dev");

  process.env.BABEL_ENV = options.mode;
  process.env.BROWSERSLIST_ENV = options.mode;

  /**
   * Client-side application bundle.
   *
   * @see https://webpack.js.org/configuration/
   * @type {Configuration}
   */
  const appConfig = {
    name: "app",
    mode: isEnvProduction ? "production" : "development",
    target: isDevServer ? "web" : "browserslist",
    bail: isEnvProduction,

    entry: "./main",

    output: {
      path: path.resolve(__dirname, "../dist/web"),
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/[name].js",
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/[name].js",
      publicPath: "/",
      uniqueName: "app",
    },

    devtool: isEnvProduction ? "source-map" : "cheap-module-source-map",

    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          commons: {
            test: /[\\/].yarn[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },

    performance: {
      maxAssetSize: 600 * 1024,
      maxEntrypointSize: 600 * 1024,
    },

    resolve: {
      extensions: [".wasm", ".mjs", ".js", ".ts", ".tsx", ".json"],
      alias: {
        ...(isEnvProductionProfile && {
          "react-dom$": "react-dom/profiling",
          "scheduler/tracing": "scheduler/tracing-profiling",
        }),
      },
    },

    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve("url-loader"),
              options: {
                limit: 10000,
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
            {
              test: /\.(js|mjs|ts|tsx)$/,
              include: path.resolve(__dirname),
              loader: "babel-loader",
              options: {
                rootMode: "upward",
                plugins: [
                  ["@babel/plugin-transform-runtime", { useESModules: true }],
                  "relay",
                  isDevServer && "react-refresh/babel",
                ].filter(Boolean),
                cacheDirectory: `../.cache/${pkg.name}.babel-loader`,
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
          ],
        },
      ],
    },

    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, "public/index.html"),
        ...(isEnvProduction && {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        }),
      }),
      isEnvProduction &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      !isDevServer &&
        new CopyWebpackPlugin({
          patterns: [
            {
              from: "./public",
              filter: (filename) =>
                filename !== path.resolve(__dirname, "public/index.html"),
            },
          ],
        }),
      new webpack.DefinePlugin({
        "process.env.APP_NAME": JSON.stringify("React App"),
        "process.env.APP_ORIGIN": JSON.stringify(prodEnv.APP_ORIGIN),
      }),
      isDevServer && new webpack.HotModuleReplacementPlugin(),
      isDevServer && new ReactRefreshWebpackPlugin(),
      new WebpackManifestPlugin({
        fileName: "assets.json",
        publicPath: "/",
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ].filter(Boolean),
  };

  /**
   * Cloudflare Worker script acting as a reverse proxy.
   *
   * @see https://webpack.js.org/configuration/
   * @type {Configuration}
   */
  const proxyConfig = {
    ...appConfig,
    name: "proxy",
    entry: "./proxy",
    output: {
      path: appConfig.output.path,
      filename: "proxy.js",
      uniqueName: "proxy",
    },
    performance: {
      maxAssetSize: 1000 * 1024,
      maxEntrypointSize: 1000 * 1024,
    },
    devtool: false,
    target: "browserslist:last 2 Chrome versions",
    plugins: [
      new IgnoreAsyncImportsPlugin(),
      new webpack.DefinePlugin({
        GOOGLE_CLOUD_REGION: JSON.stringify(prodEnv.GOOGLE_CLOUD_REGION),
        GOOGLE_CLOUD_PROJECT: JSON.stringify({
          prod: prodEnv.GOOGLE_CLOUD_PROJECT,
          test: testEnv.GOOGLE_CLOUD_PROJECT,
          dev: devEnv.GOOGLE_CLOUD_PROJECT,
        }),
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    optimization: {
      ...appConfig.optimization,
      splitChunks: {},
      runtimeChunk: false,
    },
  };

  /**
   * Development server that provides live reloading.
   *
   * @see https://webpack.js.org/configuration/dev-server/
   * @type {import("webpack-dev-server").Configuration}
   */
  const devServer = {
    compress: true,
    static: "./public",
    historyApiFallback: {
      disableDotRule: true,
    },
    port: 3000,
    hot: true,
    proxy: [
      {
        context: ["/auth", "/graphql"],
        target: "http://localhost:8080",
      },
      {
        context: ["/img"],
        target: process.env.APP_ORIGIN,
        changeOrigin: true,
        secure: false,
      },
    ],
  };

  return isDevServer ? { ...appConfig, devServer } : [appConfig, proxyConfig];
};
