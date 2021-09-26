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
import fs from "fs-extra";
import minimist from "minimist";
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
    format: "cjs",
    sourcemap: true,
    chunkFileNames: "[name].chunk.js",
  },

  plugins: [
    del({
      targets: ["./dist/*", "./dist/.yarn/releases"],
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
            const pkg = JSON.parse(content);
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
          src: ["../.yarn/releases", "../.yarn/plugins"],
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
        execArgv: ["-r", "../.pnp.cjs", "-r", "source-map-support/register"],
      }),

    // Prepare the output bundle for Yarn Zero-install
    !isWatch && {
      name: "yarn",
      async writeBundle() {
        await new Promise((resolve) => {
          spawn("yarn", ["install"], {
            stdio: ["ignore", "inherit", "ignore"],
            cwd: "./dist",
            env: { ...process.env, YARN_ENABLE_IMMUTABLE_INSTALLS: "false" },
          }).on("exit", (code) => {
            if (code !== 0) process.exit(code);
            resolve();
          });
        });
        await fs.remove("./dist/.yarn/unplugged");
        await fs.remove("./dist/.yarn/install-state.gz");
      },
    },
  ],

  external: Object.keys(pkg.dependencies),

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
