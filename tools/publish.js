#!/usr/bin/env node
/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const cp = require('child_process');
const pkg = require('../package.json');

const host = process.argv[2];
const composeFile = '/usr/src/app/docker-compose.yml';

if (!host) {
  console.log(`Usage:

  node tools/publish.js <host>

Options:

  --no-up      Do not run 'docker-compose up' after deployment
  --no-prune   Do not run 'docker image prune' after deployment
`);
  process.exit();
}

cp.spawnSync(
  'docker-compose',
  [
    'run',
    '--rm',
    '--no-deps',
    'api',
    '/bin/sh',
    '-c',
    'yarn install; yarn run build',
  ],
  { stdio: 'inherit' },
);
cp.spawnSync('docker', ['build', '--no-cache', '--tag', pkg.name, '.'], {
  stdio: 'inherit',
});
const ssh = cp.spawn('ssh', ['-C', host, 'docker', 'load'], {
  stdio: ['pipe', 'inherit', 'inherit'],
});
const docker = cp.spawn('docker', ['save', pkg.name], {
  stdio: ['inherit', ssh.stdin, 'inherit'],
});
docker.on('exit', () => {
  ssh.stdin.end();
});
ssh.on('exit', () => {
  if (process.argv.includes('--no-up')) return;
  cp.spawnSync(
    'ssh',
    ['-C', host, 'docker-compose', '-f', composeFile, 'up', '-d'],
    { stdio: 'inherit' },
  );
  if (process.argv.includes('--no-prune')) return;
  cp.spawnSync('ssh', ['-C', host, 'docker', 'image', 'prune', '-a', '-f'], {
    stdio: 'inherit',
  });
});
