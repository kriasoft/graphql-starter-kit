/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const task = require('./task');

let build;
let server;

// Run `node build/server.js` on a background thread
function spawnServerProcess() {
  const args = process.env.NODE_DEBUG === 'true' ? ['--inspect', '--no-lazy'] : [];
  server = cp.spawn('node', [...args, 'server.js'], { cwd: './build', stdio: 'inherit' });
}

// Gracefull shutdown
process.once('cleanup', () => {
  if (server) {
    server.removeListener('exit', spawnServerProcess);
    server.addListener('exit', () => {
      server = null;
      process.exit();
    });
    server.kill('SIGTERM');
  } else {
    process.exit();
  }
});
process.on('SIGINT', () => process.emit('cleanup'));
process.on('SIGTERM', () => process.emit('cleanup'));

// Ensure that Node.js modules were installed,
// at least those required to build and launch the app
try {
  build = require('./build');
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') throw err;
  // Install Node.js modules with Yarn
  cp.spawnSync('yarn', ['install', '--no-progress'], { stdio: 'inherit' });

  // Clear Module's internal cache
  try {
    const Module = require('module');
    const m = new Module();
    // eslint-disable-next-line
    m._compile(fs.readFileSync('./scripts/build.js', 'utf8'), path.resolve('./scripts/build.js'));
  } catch (error) { } // eslint-disable-line

  // Reload dependencies
  build = require('./build');
}

module.exports = task('run', () => Promise.resolve()
  // Migrate database schema to the latest version
  .then(() => {
    cp.spawnSync('node', ['--harmony', 'scripts/db.js', 'migrate'], { stdio: 'inherit' });
  })
  // Compile and launch the app in watch mode, restart it after each rebuild
  .then(() => build({
    watch: true,
    onComplete() {
      if (server) {
        server.removeListener('exit', spawnServerProcess);
        server.addListener('exit', spawnServerProcess);
        server.kill();
      } else {
        spawnServerProcess();
      }
    },
  }))
  // Resolve the promise on exit
  .then(() => new Promise((resolve) => {
    process.once('exit', () => {
      if (server) server.kill();
      resolve();
    });
  })));
