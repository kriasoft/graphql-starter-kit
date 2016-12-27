/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const cp = require('child_process');
const task = require('./task');
const build = require('./build');

let node; /* Node.js server child process */

function launch() {
  node = cp.spawn('node',
    [
      ...(process.env.NODE_DEBUG === 'true' ? ['--inspect', '--no-lazy'] : []),
      'server.js',
    ],
    {
      cwd: './build',
      stdio: 'inherit',
    });
}

module.exports = task('start', () =>
  build({
    watch: true,
    onComplete() {
      if (node) {
        node.removeListener('exit', launch);
        node.addListener('exit', launch);
        node.kill();
      } else {
        launch();
      }
    },
  })
  .then(() => new Promise((resolve) => {
    process.on('exit', () => {
      if (node) {
        node.on('exit', () => resolve());
        node.kill();
      } else {
        resolve();
      }
    });
    process.once('SIGINT', () => process.exit(0));
  })));
