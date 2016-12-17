/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const cp = require('child_process');
const task = require('./task');
const build = require('./build');
const pkg = require('../package.json');

module.exports = task('deploy', () => Promise.resolve()
  // Compile the app into the /build folder
  .then(build)
  // Create Docker image and push it to a remote server
  .then(() => {
    console.log('pkg.name:', pkg.name);
    cp.spawnSync('docker', ['build', '-t', pkg.name, '.'], { stdio: 'inherit' });
    throw new Error('TODO: Update deployment logic in /scripts/deploy.js');
  }));
