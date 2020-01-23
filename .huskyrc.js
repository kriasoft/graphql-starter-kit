/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

// Git hooks
// https://github.com/typicode/husky
module.exports = {
  hooks: {
    'pre-commit': 'yarn lint',
  },
};
