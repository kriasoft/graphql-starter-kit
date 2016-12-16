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
const task = require('../src/utils/task');

module.exports = task('start', () => new Promise((resolve) => {
  let start;

  const nm = nodemon({
    watch: [path.join(__dirname, '../src')],
    ignore: [],
    stdin: false,
    script: 'src/server.js',
    nodeArgs: ['--require', 'babel-register', ...process.argv.filter(x => x.startsWith('-'))],
    stdout: false,
  })
    .on('stdout', (data) => {
      if (data.toString().includes(' is listening on ')) {
        console.log(`Finished 'build' after ${new Date().getTime() - start.getTime()}ms`);
      }
      process.stdout.write(data);
    })
    .on('stderr', data => process.stderr.write(data))
    .on('start', () => {
      start = new Date();
      console.log('Starting \'build\'...');
    });

  process.on('exit', () => nm.emit.bind(nm, 'exit'));
  process.once('SIGINT', process.exit.bind(process, 0));
}));
