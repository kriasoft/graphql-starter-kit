/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const fs = require('fs');
const task = require('./task');

// Creates .env file from the template (.env.example)
// with application settings for the development environment
module.exports = task('setup', () => {
  if (!fs.existsSync('.env.example')) {
    return;
  }

  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', fs.readFileSync('.env.example', 'utf8'), 'utf8');
    console.log('.env.example -> .env');
  }
});
