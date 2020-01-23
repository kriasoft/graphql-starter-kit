/**
 * Knex.js CLI configuration
 * http://knexjs.org/#knexfile
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const cp = require('child_process');
const dotenv = require('dotenv');
const minimist = require('minimist');
const { config } = require('./src/db');

const { env = 'dev' } = minimist(process.argv.slice(2));

// Load prod/test database connection settings from Firebase
// https://firebase.google.com/docs/functions/config-env
function loadEnvironmentVariables(project: string): void {
  const { status, stdout } = cp.spawnSync(
    'firebase',
    ['--project', project, 'functions:config:get'],
    { stdio: ['pipe', 'pipe', 'inherit'] },
  );

  if (status !== 0) process.exit(status);

  const config = JSON.parse(stdout.toString()).app;
  process.env.PGDATABASE = config.pgdatabase || process.env.PGDATABASE;
  process.env.PGUSER = config.pguser || process.env.PGUSER;
  process.env.PGPASSWORD = config.pgpassword || process.env.PGPASSWORD;
}

if (env === 'local') {
  dotenv.config({ path: '.env.local' });
  process.env.PGPORT = process.env.PGPORT || '5432';
  process.env.PGHOST = process.env.PGHOST || 'localhost';
  process.env.PGUSER = process.env.PGUSER || 'postgres';
  process.env.PGPASSWORD = process.env.PGPASSWORD || '';
  process.env.PGSSLMODE = process.env.PGSSLMODE || 'disable';
} else if (env !== 'dev') {
  loadEnvironmentVariables(`example-${env}`); // TODO: Replace "example" with the actual project ID

  // const dbEnv = env === 'prod' ? 'prod' : 'dev';
  // process.env.PGHOST = 'X.X.X.X';
  // process.env.PGPOST = '5432';
  // process.env.PGSSLMODE = 'require';
  // process.env.PGSSLCERT = `./ssl/client-cert.${dbEnv}.pem`;
  // process.env.PGSSLKEY = `./ssl/client-key.${dbEnv}.pem`;
  // process.env.PGSSLROOTCERT = `./ssl/server-ca.${dbEnv}.pem`;
}

dotenv.config({ path: '.env' });

module.exports = config;
