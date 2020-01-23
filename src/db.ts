/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import fs from 'fs';
import knex, { Config } from 'knex';

// Knex.js database client configuration
// https://knexjs.org/#Installation-client
export const config: Config = {
  client: 'pg',

  connection: {
    ssl: (process.env.PGSSLMODE || 'disable') !== 'disable' && {
      rejectUnauthorized: false,
      cert: fs.readFileSync(String(process.env.PGSSLCERT), 'utf8'),
      key: fs.readFileSync(String(process.env.PGSSLKEY), 'utf8'),
      ca: fs.readFileSync(String(process.env.PGSSLROOTCERT), 'utf8'),
    },
  },

  // Note that the max connection pool size must be set to 1
  // in a serverless environment.
  pool: {
    min: process.env.NODE_ENV === 'production' ? 1 : 0,
    max: 1,
  },

  migrations: {
    tableName: 'migrations',
  },

  debug: process.env.PGDEBUG === 'true',
};

export default knex(config);
