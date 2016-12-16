/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/*
 * Minimalistic script runner for build automation scripts (see /scripts/*.js).
 *
 * Usage example:
 *
 *     node scripts/db.js create
 *     Starting 'db:create'...
 *     Finished 'db:create' in 25ms
 */

const dotenv = require('dotenv');

dotenv.config({ silent: true });

function run(task, action) {
  const command = process.argv[2];
  const taskName = command && !command.startsWith('-') ? `${task}:${command}` : task;
  const start = new Date();
  process.stdout.write(`Starting '${taskName}'...\n`);
  return Promise.resolve().then(() => action()).then(() => {
    process.stdout.write(`Finished '${taskName}' after ${new Date().getTime() - start.getTime()}ms\n`);
  }, err => process.stderr.write(`${err.stack}\n`));
}

process.nextTick(() => require.main.exports());

module.exports = (task, action) => run.bind(undefined, task, action);
