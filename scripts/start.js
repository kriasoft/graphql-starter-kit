/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const path = require('path');
const nodemon = require('nodemon');
require('./lib/task');
const config = require('../src/config');

module.exports = () => {
  process.stdout.write('\033c');
  nodemon({
    watch: [path.join(__dirname, 'src')],
    ignore: [],
    verbose: true,
    script: 'src/server.js',
    nodeArgs: ['--require', 'babel-register', ...process.argv.filter(x => x.startsWith('-'))],
    stdout: false,
  })
    .on('stdout', data => {
      if (data.toString().includes(config.message)) {
        process.stdout.write('\033c');
      }
      process.stdout.write(data);
    })
    .on('stderr', data => process.stderr.write(data))
    .on('start', () => process.stdout.write('\033cBuilding...'));
};
