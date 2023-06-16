/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { readFileSync } from "node:fs";
import { defineWorkspace } from "vitest/config";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

/**
 * Inline Vitest configuration for all workspaces.
 *
 * @see https://vitest.dev/guide/workspace
 */
export default defineWorkspace(
  pkg.workspaces
    .filter((name: string) => !["db", "img", "scripts"].includes(name))
    .map((name: string) => ({
      extends: `./${name}/vite.config.ts`,
      test: {
        name,
        root: `./${name}`,
      },
    })),
);
