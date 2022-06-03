/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import run from "@rollup/plugin-run";
import spawn from "cross-spawn";
import envars from "envars";
import minimist from "minimist";
import fs from "node:fs/promises";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import pkg from "./package.json";

// AKA, development mode
const isWatch = process.env.ROLLUP_WATCH === "true";
const args = minimist(process.argv.slice(-2));

// Load environment variables
envars.config({ env: args.env });

/**
 * Rollup bundler configuration.
 *
 * @see https://rollupjs.org/
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: "./index.ts",

  output: {
    dir: "./dist",
    format: "es",
    sourcemap: true,
    chunkFileNames: "[name].chunk.js",
  },

  plugins: [
    del({
      targets: ["./dist/*", "./dist/.yarn/*"],
      runOnce: true,
    }),

    copy({
      targets: [
        {
          src: "views/**",
          dest: "./dist/views",
        },
        {
          src: "package.json",
          dest: "./dist",
          copyOnce: true,
          transform(content) {
            const pkg = JSON.parse(content.toString());
            delete pkg.scripts;
            delete pkg.devDependencies;
            delete pkg.envars;
            delete pkg.babel;
            return JSON.stringify(pkg, null, "  ");
          },
        },
        {
          src: ["../.yarnrc.yml", "../yarn.lock"],
          dest: "./dist",
          copyOnce: true,
        },
        {
          src: ["../.yarn/releases"],
          dest: "./dist/.yarn",
          copyOnce: true,
        },
      ],
      copyOnce: true,
    }),

    nodeResolve({
      extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".node"],
      preferBuiltins: true,
    }),

    commonjs(),

    json(),

    babel({
      extensions: [".ts", ".tsx", ".js", ".mjs"],
      babelHelpers: "bundled",
      rootMode: "upward",
    }),

    !isWatch &&
      replace({
        "process.env.NODE_ENV": `"production"`,
        preventAssignment: true,
      }),

    isWatch &&
      run({
        execArgv: [
          "--require=../.pnp.cjs",
          "--require=source-map-support/register",
          "--no-warnings",
        ],
      }),

    !isWatch && {
      name: "yarn",
      async writeBundle() {
        // Disable global cache to make it work with Google Cloud Buildpacks
        spawn.sync("yarn", ["config", "set", "enableGlobalCache", "false"], {
          cwd: "./dist",
          stdio: "inherit",
        });
        // Update yarn.lock file to include only the production dependencies
        spawn.sync("yarn", ["install", "--mode=update-lockfile"], {
          env: {
            ...process.env,
            NODE_OPTIONS: undefined,
            YARN_ENABLE_IMMUTABLE_INSTALLS: "false",
          },
          cwd: "./dist",
          stdio: "inherit",
        });
        await fs.writeFile(
          "dist/.gcloudignore",
          ".pnp.*\n.yarn/*\n!.yarn/patches\n!.yarn/plugins\n!.yarn/releases\n.gcloudignore\nenv.yml\n",
        );
      },
    },
  ],

  external: [...Object.keys(pkg.dependencies), /^node:/].filter(
    // Bundle modules that do not properly support ES
    (dep) => !["@sendgrid/mail", "http-errors"].includes(dep),
  ),

  // Suppress warnings in 3rd party libraries
  onwarn(warning, warn) {
    if (
      !(
        warning.id?.includes("node_modules") ||
        warning.message?.startsWith("Unknown CLI flags: env.")
      )
    ) {
      warn(warning);
    }
  },
};

export default config;
