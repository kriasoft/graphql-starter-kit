/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

/**
 * ESLint configuration
 *
 * @see https://eslint.org/docs/user-guide/configuring
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  root: true,

  env: {
    es6: true,
    node: true,
  },

  extends: ["eslint:recommended", "prettier"],

  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
  },

  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
      plugins: ["@typescript-eslint"],
      parserOptions: {
        sourceType: "module",
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
    {
      files: ["*.tsx"],
      extends: ["plugin:react/recommended"],
      plugins: ["jsx-a11y", "react-hooks", "@emotion"],
      env: {
        browser: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        "react/no-children-prop": "off",
        "react/react-in-jsx-scope": "off",
      },
    },
    {
      files: ["proxy/**/*.ts"],
      env: {
        worker: true,
        node: false,
      },
    },
  ],

  ignorePatterns: [
    "/.cache",
    "/.git",
    "/.husky",
    "/.yarn",
    "/*/dist/",
    "/**/__snapshots__",
    "/**/node_modules",
    "/coverage",
    "/dist/",
    "/.pnp.cjs",
    "/.pnp.loader.mjs",
  ],

  settings: {
    "import/resolver": {
      typescript: {
        project: ["app/tsconfig.json", "edge/tsconfig.json"],
      },
    },
    react: {
      version: "detect",
    },
  },
};
