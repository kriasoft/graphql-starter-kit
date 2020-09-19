/**
 * Jest configuration
 *
 * @see https://jestjs.io/docs/en/configuration
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 *
 * @type {import("@jest/types").Config.InitialOptions}
 */

module.exports = {
  testPathIgnorePatterns: [
    "<rootDir>/.cache/",
    "<rootDir>/.github/",
    "<rootDir>/.vscode/",
    "<rootDir>/.yarn/",
    "<rootDir>/db/",
    "<rootDir>/dist/",
    "<rootDir>/scripts/",
    "<rootDir>/web/out/",
  ],
};
