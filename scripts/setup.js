/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const fs = require('fs');
const task = require('../src/utils/task');

// Creates .env file from the template (.env.example)
// with application settings for the development environment
module.exports = task('setup', () => new Promise((resolve, reject) => {
  fs.open('.env', 'wx', (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        resolve();
      } else {
        reject(err);
      }
    } else {
      fs.readFile('.env.example', 'utf8', (err2, data) => {
        if (err2) {
          reject(err2);
        } else {
          fs.write(fd, data, 'utf8', (err3) => {
            if (err3) {
              reject(err3);
            } else {
              console.log('.env.example -> .env');
              resolve();
            }
          });
        }
      });
    }
  });
}));
