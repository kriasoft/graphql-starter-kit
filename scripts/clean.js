/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const rimraf = require('rimraf');
const task = require('../src/utils/task');

module.exports = task('clean', () => new Promise((resolve, reject) => {
  rimraf('build/*', {
    nosort: true,
    dot: true,
    ignore: ['build/.git'],
  }, (err) => {
    if (err) reject(err);
    resolve();
  });
}));
