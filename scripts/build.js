/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const fs = require('fs');
const cp = require('child_process');
const pkg = require('../package.json');
const clean = require('./clean');
const task = require('./task');

module.exports = task('build', () => Promise.resolve()
  .then(clean)
  // Copy database migration scripts so you could run `node scripts/db.js migrate` on the server
  .then(() => {
    ['build', 'build/migrations', 'build/scripts'].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    });
    [
      ...fs.readdirSync('migrations').map(file => `migrations/${file}`),
      ...fs.readdirSync('scripts').map(file => `scripts/${file}`),
      'yarn.lock',
    ].forEach((file) => {
      fs.writeFileSync(`build/${file}`, fs.readFileSync(file, 'utf8'), 'utf8');
      console.log(`${file} -> build/${file}`);
    });
  })
  // Compile Node.js application from source code with Babel
  .then(() => new Promise((resolve) => {
    cp.spawn('node', [
      'node_modules/babel-cli/bin/babel.js',
      'src',
      '--out-dir',
      'build',
      '--source-maps',
      '--copy-files',
      ...(process.argv.includes('--watch') || process.argv.includes('-w') ? ['--watch'] : []),
    ], { stdio: ['inherit', 'pipe', 'inherit'] })
      .on('exit', resolve)
      .stdout.on('data', (data) => {
        if (data.toString().startsWith('src/server.js')) {
          const src = fs.readFileSync('build/server.js', 'utf8');
          fs.writeFileSync('build/server.js', `require('source-map-support').install(); ${src}`, 'utf8');
        }
        process.stdout.write(data);
      });
  }))
  // Copy package.json in order to be able to run `yarn install` on the server
  .then(() => {
    fs.writeFileSync('build/package.json', JSON.stringify({
      engines: pkg.engines,
      dependencies: pkg.dependencies,
      scripts: pkg.scripts,
    }, null, '  '), 'utf8');
    console.log('package.json -> build/package.json');
  }));
