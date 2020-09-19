/**
 * ESLint configuration
 *
 * @see https://eslint.org/docs/user-guide/configuring
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 *
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
    ecmaVersion: 2020,
  },

  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
      ],
      plugins: ["@typescript-eslint"],
      parserOptions: {
        sourceType: "module",
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
    {
      files: ["*.tsx"],
      extends: ["plugin:react/recommended", "prettier/react"],
      plugins: ["jsx-a11y", "react-hooks"],
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
      },
    },
    {
      files: ["*.test.ts", "*.test.tsx"],
      env: {
        jest: true,
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
    "/.yarn",
    "/**/__snapshots__",
    "/**/node_modules",
    "/coverage",
    "/dist/",
    "/web/out/",
  ],
};
