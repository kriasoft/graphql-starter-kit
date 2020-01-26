/**
 * Knex.js CLI configuration (try running `yarn db --env=dev`)
 * http://knexjs.org/#knexfile
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

const dotenv = require('dotenv');
const minimist = require('minimist');

const { env = 'dev' } = minimist(process.argv.slice(2));

if (env === 'local') {
  dotenv.config({ path: '.env.local' });
  process.env.PGPORT = process.env.PGPORT || '5432';
  process.env.PGHOST = process.env.PGHOST || 'localhost';
  process.env.PGUSER = process.env.PGUSER || 'postgres';
  process.env.PGPASSWORD = process.env.PGPASSWORD || '';
  process.env.PGSSLMODE = process.env.PGSSLMODE || 'disable';
} else if (env === 'prod') {
  dotenv.config({ path: '.env.production.local' });
} else if (env !== 'dev') {
  process.env.PGDATABASE = `stridist_${env}`;
}

dotenv.config({ path: '.env' });

module.exports = require('./src/db').config;
