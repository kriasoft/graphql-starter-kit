/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import { loadEnv } from "envars";
import { resolve } from "node:path";
import { defineProject } from "vitest/config";

/**
 * Vite configuration.
 * @see https://vitejs.dev/config/
 */
export default defineProject(async ({ mode }) => {
  // Load environment variables from `.env` files
  // https://vitejs.dev/config/#using-environment-variables-in-config
  await loadEnv(mode, {
    root: "..",
    schema: "./core/env.ts",
    mergeTo: process.env,
  });

  return {
    cacheDir: "../.cache/vite-api",

    build: {
      ssr: "./index.ts",
      emptyOutDir: true,
      sourcemap: "inline",
    },

    ssr: {},

    plugins: [
      viteCommonjs({
        include: ["graphql-relay"],
      }),
    ],

    server: {
      port: 8080,
      deps: {
        inline: ["graphql", "graphql-relay"],
      },
    },

    test: {
      ...{ cache: { dir: resolve(__dirname, "../.cache/vitest") } },
      environment: "node",
      testTimeout: 10000,
      teardownTimeout: 10000,
      server: {
        deps: {
          inline: ["graphql", "graphql-relay"],
        },
      },
    },
  };
});
