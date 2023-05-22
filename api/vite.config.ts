/* SPDX-FileCopyrightText: 2014-present Kriasoft */

import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import envars from "envars";
import { execa } from "execa";
import { debounce } from "lodash-es";
import path from "node:path";
import { PluginOption } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import { defineProject } from "vitest/config";

// Load environment variables for the target environment
envars.config();

/**
 * Vite configuration
 * https://vitejs.dev/config/
 */
export default defineProject(({ mode }) => ({
  cacheDir: "../.cache/vite-api",

  build: {
    outDir: "./dist",
    emptyOutDir: false,
    sourcemap: "hidden",
  },

  ssr: {
    ...(mode === "production" && {
      noExternal:
        mode === "production"
          ? ["http-errors", "firebase-admin/app", "firebase-admin/auth", "jose"]
          : mode === "test"
          ? ["graphql-relay", "graphql-helix"]
          : undefined,
    }),
  },

  plugins: [
    viteCommonjs({
      include: ["graphql-relay"],
    }),
    ...(VitePluginNode({
      adapter: "express",
      appPath: "./index.ts",
      exportName: "api",
    }) as unknown as PluginOption[]),
    {
      name: "UpdateSchema",
      configureServer(server) {
        if (mode === "development") {
          const updateSchema = debounce(async () => {
            try {
              const module = await server.ssrLoadModule("./index.ts");
              await module.updateSchema();
              await execa(
                "yarn",
                ["prettier", "--write", "./api/schema.graphql"],
                { cwd: path.resolve(process.cwd(), "..") },
              );
            } catch (err) {
              console.error(err);
            }
          }, 1000);

          server.watcher.on("all", (event, path) => {
            if (!path.endsWith(".graphql")) updateSchema();
          });

          updateSchema();
        }
      },
    },
  ],

  server: {
    port: 8080,
  },

  test: {
    ...{ cache: { dir: "../.cache/vitest" } },
    environment: "node",
    setupFiles: ["./utils/setupTests.ts"],
    testTimeout: 10000,
    teardownTimeout: 10000,
    deps: {
      inline: ["graphql-relay", "graphql-helix"],
    },
  },
}));
