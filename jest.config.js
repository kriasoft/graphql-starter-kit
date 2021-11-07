/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Jest configuration
 *
 * @see https://jestjs.io/docs/en/configuration
 * @type {import("@jest/types").Config.InitialOptions}
 */
module.exports = {
  testPathIgnorePatterns: [
    "<rootDir>/.cache/",
    "<rootDir>/.github/",
    "<rootDir>/.vscode/",
    "<rootDir>/.yarn/",
    "<rootDir>/api/dist/",
    "<rootDir>/db/",
    "<rootDir>/scripts/",
    "<rootDir>/web/dist/",
  ],
};
