/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { compile } from "ejs";
import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { defineProject } from "vitest/config";
import { getCloudflareBindings } from "../scripts/utils";

export default defineProject({
  cacheDir: "../.cache/vite-edge",

  // Production build configuration
  // https://vitejs.dev/guide/build
  build: {
    lib: {
      entry: "index.ts",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["__STATIC_CONTENT_MANIFEST"],
    },
  },

  plugins: [
    {
      name: "ejs",
      async transform(_, id) {
        if (id.endsWith(".ejs")) {
          const src = await readFile(id, "utf-8");
          const code = compile(src, {
            client: true,
            strict: true,
            localsName: "env",
            views: [resolve(__dirname, "views")],
            filename: relative(__dirname, id),
          }).toString();
          return `export default ${code}`;
        }
      },
    },
  ],

  resolve: {
    alias: {
      ["__STATIC_CONTENT_MANIFEST"]: resolve("./core/manifest.ts"),
    },
  },

  // Unit testing configuration
  // https://vitest.dev/config/
  test: {
    ...{ cache: { dir: "../.cache/vitest" } },
    deps: {
      // ...{ registerNodeLoader: true },
      external: ["__STATIC_CONTENT_MANIFEST"],
    },
    environment: "miniflare",
    environmentOptions: {
      bindings: getCloudflareBindings(resolve(__dirname, "wrangler.toml")),
    },
  },
});
