/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

envars.config({ env: process.env.APP_ENV ?? "local" });

/**
 * Jest configuration
 * https://jestjs.io/docs/configuration
 *
 * @type {import("jest").Config}
 */
export default {
  cacheDirectory: "./.cache/jest",

  testMatch: ["**/*.test.ts", "**/*.test.tsx"],

  projects: [
    {
      displayName: "api",
      rootDir: getRootDir("api"),
      testEnvironment: "jest-environment-node",
      transform: { "\\.(js|ts)$": ["babel-jest", { rootMode: "upward" }] },
      transformIgnorePatterns: [`/node_modules/(?!(${getESModules()})/)`],
      setupFiles: ["<rootDir>/utils/setupTests.ts"],
    },
  ],
};

function getRootDir(name) {
  return path.join(fileURLToPath(import.meta.url), "..", name);
}

function getESModules() {
  return [
    "@sindresorhus/is",
    "@szmarczak/http-timer",
    "cacheable-lookup",
    "cacheable-request",
    "form-data-encoder",
    "got",
    "lodash-es",
    "lowercase-keys",
    "mimic-response",
    "nanoid",
    "normalize-url",
    "p-cancelable",
    "responselike",
  ].join("|");
}
