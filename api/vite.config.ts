/* SPDX-FileCopyrightText: 2014-present Kriasoft */

import envars from "envars";
import { execa } from "execa";
import { debounce } from "lodash-es";
import path from "node:path";
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

// Load environment variables for the target environment
envars.config();

/**
 * Vite configuration
 * https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => ({
  cacheDir: "../.cache/vite-api",

  build: {
    outDir: "./dist",
    emptyOutDir: false,
    sourcemap: "hidden",
  },

  ssr: {
    ...(mode === "production" && {
      noExternal: [
        "http-errors",
        "firebase-admin/app",
        "firebase-admin/auth",
        "jose",
      ],
    }),
  },

  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./index.ts",
      exportName: "api",
    }),
    {
      name: "UpdateSchema",
      configureServer(server) {
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
      },
    },
  ],

  server: {
    port: 8080,
  },
}));
