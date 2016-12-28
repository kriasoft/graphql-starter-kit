/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const fs = require('fs');
const cp = require('child_process');

let task;
let build;
let server;

// Run `node build/server.js` on a background thread
function spawnServerProcess() {
  const args = process.env.NODE_DEBUG === 'true' ? ['--inspect', '--no-lazy'] : [];
  server = cp.spawn('node', [...args, 'server.js'], { cwd: './build', stdio: 'inherit' });
}

// Gracefull shutdown
process.on('cleanup', () => {
  if (server) {
    server.removeListener('exit', spawnServerProcess);
    server.addListener('exit', () => process.exit(0));
    server.kill('SIGTERM');
  } else {
    process.exit(0);
  }
});
process.on('SIGINT', () => process.emit('cleanup'));
process.on('SIGTERM', () => process.emit('cleanup'));

// Ensure that Node.js modules were installed,
// at least those required to build and launch the app
try {
  task = require('./task');
  build = require('./build');
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') throw err;
  console.log('Installing Node.js modules...');
  // Install Yarn if it's missing. TODO: Use a Node.js image with Yarn pre-installed.
  if (!fs.existsSync('/usr/local/bin/yarn')) {
    cp.spawnSync('npm', ['install', 'yarn', '-g', '--silent'], { stdio: ['ignore', 'ignore', 'inherit'] });
  }
  // Install Node.js modules with Yarn
  cp.spawnSync('yarn', ['install', '--no-progress'], { stdio: 'inherit' });
  process.exit(0);
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
    process.on('exit', () => { resolve(); process.exit(0); });
  })));
