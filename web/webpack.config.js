/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

const path = require("node:path");
const envars = require("envars");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const InlineChunkHtmlPlugin = require("inline-chunk-html-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { IgnoreAsyncImportsPlugin } = require("ignore-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { sync: spawnSync } = require("cross-spawn");

const imageInlineSizeLimit = 10000;

// The list of environment variables (found in `/env/*.env` files)
// that need to be injected into the client-side app
const envVars = [
  "APP_ENV",
  "APP_NAME",
  "APP_ORIGIN",
  "API_ORIGIN",
  "FIREBASE_AUTH_KEY",
  "GOOGLE_CLOUD_PROJECT",
  "GA_MEASUREMENT_ID",
];

/**
 * Webpack configuration.
 *
 * @see https://webpack.js.org/configuration/
 * @param {Record<string, boolean> | undefined} env
 * @param {{ mode: "production" | "development" }} options
 * @returns {import("webpack").Configuration}
 */
module.exports = function config(env, options) {
  // Load environment variables (API_ORIGIN, etc.)
  const envName = env.prod ? "prod" : env.test ? "test" : "local";
  envars.config({ env: envName });

  // Fetch the API origin URL from Google Cloud Functions (GCF)
  if (envName !== "local") {
    const cp = spawnSync("gcloud", [
      ...[`beta`, `functions`, `describe`, `api`, `--gen2`],
      `--project=${process.env.GOOGLE_CLOUD_PROJECT}`,
      `--region=${process.env.GOOGLE_CLOUD_REGION}`,
      `--format=value(serviceConfig.uri)`,
    ]);
    process.env.API_ORIGIN = cp.stdout.toString().trim();
  } else {
    process.env.API_ORIGIN = "http://localhost:8080";
  }

  const isEnvProduction = options.mode === "production";
  const isEnvDevelopment = options.mode === "development";
  const isDevServer = isEnvDevelopment && process.argv.includes("serve");
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes("--profile");

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

    entry: "./index",

    output: {
      path: path.resolve(__dirname, "dist"),
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
            parse: { ecma: 8 },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: { safari10: true },
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: { ecma: 5, comments: false, ascii_only: true },
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
      maxAssetSize: 650 * 1024,
      maxEntrypointSize: 650 * 1024,
    },

    resolve: {
      extensions: [".wasm", ".mjs", ".js", ".ts", ".d.ts", ".tsx", ".json"],
      alias: {
        ...(isEnvProductionProfile && {
          "react-dom$": "react-dom/profiling",
          "scheduler/tracing": "scheduler/tracing-profiling",
        }),
      },
    },

    module: {
      strictExportPresence: true,
      rules: [
        // Handle node_modules packages that contain sourcemaps
        {
          enforce: "pre",
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          use: "source-map-loader",
        },
        {
          oneOf: [
            // TODO: Merge this config once `image/avif` is in the mime-db
            // https://github.com/jshttp/mime-db
            {
              test: [/\.avif$/],
              loader: require.resolve("url-loader"),
              options: {
                limit: imageInlineSizeLimit,
                mimetype: "image/avif",
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve("url-loader"),
              options: {
                limit: imageInlineSizeLimit,
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
                  ["@babel/plugin-transform-runtime"],
                  [
                    "babel-plugin-import",
                    {
                      libraryName: "@mui/material",
                      libraryDirectory: "",
                      camel2DashComponentName: false,
                    },
                    "material",
                  ],
                  [
                    "babel-plugin-import",
                    {
                      libraryName: "@mui/icons-material",
                      libraryDirectory: "",
                      camel2DashComponentName: false,
                    },
                    "icons-material",
                  ],
                  [
                    "babel-plugin-import",
                    {
                      libraryName: "@mui/lab",
                      libraryDirectory: "",
                      camel2DashComponentName: false,
                    },
                    "lab",
                  ],
                  "babel-plugin-relay",
                  isDevServer && "react-refresh/babel",
                ].filter(Boolean),
                cacheDirectory: path.join(
                  __dirname,
                  "../.cache/web-babel-loader",
                ),
                cacheCompression: false,
                compact: false, // isEnvProduction,
                sourceType: "unambiguous",
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin(
        envVars.reduce(
          (acc, name) => ({
            ...acc,
            [`process.env.${name}`]: isEnvProduction
              ? `window.env.${name}`
              : JSON.stringify(process.env[name]),
          }),
          {},
        ),
      ),
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
      isDevServer && new webpack.HotModuleReplacementPlugin(),
      isDevServer && new ReactRefreshWebpackPlugin(),
      new WebpackManifestPlugin({ fileName: "assets.json", publicPath: "/" }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
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
    name: "workers",
    entry: "./workers/proxy",
    output: {
      path: path.resolve(__dirname, "dist"),
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
      new webpack.DefinePlugin(
        envVars.reduce(
          (acc, name) => ({ ...acc, [`process.env.${name}`]: `${name}` }),
          {},
        ),
      ),
      new IgnoreAsyncImportsPlugin(),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      options.analyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    optimization: {
      ...appConfig.optimization,
      splitChunks: {},
      runtimeChunk: false,
      minimize: false,
    },
  };

  /**
   * Development server that provides live reloading.
   *
   * @see https://webpack.js.org/configuration/dev-server/
   * @type {import("webpack-dev-server").Configuration}
   */
  const devServer = {
    static: "./public",
    compress: true,
    historyApiFallback: { disableDotRule: true },
    port: 3000,
    hot: true,
    proxy: [
      {
        context: ["/api", "/auth"],
        target: process.env.API_ORIGIN,
        changeOrigin: true,
        onProxyReq(proxyReq, req) {
          const origin = `${req.protocol}://${req.hostname}:3000`;
          proxyReq.setHeader("origin", origin);
        },
      },
    ],
  };

  return isDevServer ? { ...appConfig, devServer } : [appConfig, proxyConfig];
};
