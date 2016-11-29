/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const path = require('path');

function run(task, action) {
  const start = new Date();
  process.stdout.write(`Starting '${task}'...\n`);
  return Promise.resolve().then(() => action()).then(() => {
    process.stdout.write(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms\n`);
  }, err => process.stderr.write(`${err.stack}\n`));
}

module.exports = (action) => {
  const task = path.basename(module.parent.filename, '.js');
  return run.bind(undefined, task, action);
};

process.nextTick(() => require.main.exports());
