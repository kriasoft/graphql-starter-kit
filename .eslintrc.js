/**
 * ESLint Configuration
 * http://eslint.org/docs/user-guide/configuring
 * https://prettier.io/docs/en/integrating-with-linters.html#eslint
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['migrations/*.ts', 'seeds/*.ts', 'scripts/*.ts'],
      extends: 'eslint:recommended',
      parserOptions: {
        sourceType: 'module',
      },
    },
    {
      files: ['knexfile.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
};
