/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const nodemon = require('nodemon');
const config = require('./src/config');

const tasks = new Map();

function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve().then(() => tasks.get(task)()).then(() => {
    console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
  }, err => console.error(err.stack));
}

tasks.set('build', () => new Promise((resolve) => {
  const pkg = require('./package.json');
  fs.writeFileSync('build/package.json', JSON.stringify({
    engines: pkg.engines,
    dependencies: pkg.dependencies,
    scripts: {
      start: 'node app.js',
    },
  }, null, '  '), 'utf8');
  console.log('package.json -> build/package.json');

  cp.spawn(
    'node',
    [
      './node_modules/babel-cli/bin/babel.js',
      'src',
      '--out-dir',
      'build',
      '--source-maps',
    ],
    {
      stdio: 'inherit',
    }).on('exit', resolve);
}));

tasks.set('start', () => new Promise((resolve) => {
  process.stdout.write('\033c');
  nodemon({
    exec: 'babel-node',
    watch: [path.join(__dirname, 'src')],
    ignore: [],
    verbose: true,
    script: 'src/server.js',
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
}));

// Execute the specified task or default one. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);
