#!/usr/bin/env node
/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const cp = require('child_process');
const pkg = require('../package.json');

// URI of the remote host that will be serving the API server.
const host = process.argv[2];

// This is your production docker-compose file.
// This file must be present on the server hosting the production application.
// You must ensure this file is present on the server in advance of running
// the publish script.
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

// Build the API server locally.
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

// Create a Docker image based on the pre-built API server.
// This step speeds the update process and ensures the remote server
// doesn't hang while you update it.
cp.spawnSync('docker', ['build', '--no-cache', '--tag', pkg.name, '.'], {
  stdio: 'inherit',
});

// Pipe the container data to the remote host.
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

  // Using the production docker-compose configuration file (must be present
  // on the remote server already), start the API server and any dependencies
  // in the background (via -d).
  cp.spawnSync(
    'ssh',
    ['-C', host, 'docker-compose', '-f', composeFile, 'up', '-d'],
    { stdio: 'inherit' },
  );

  if (process.argv.includes('--no-prune')) return;

  // Prune any old images from the remove server.
  cp.spawnSync('ssh', ['-C', host, 'docker', 'image', 'prune', '-a', '-f'], {
    stdio: 'inherit',
  });
});
