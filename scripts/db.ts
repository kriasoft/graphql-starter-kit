/**
 * Knex.js REPL shell (try running `yarn db --env=?`)
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import repl from 'repl';
import knex from 'knex';
import config from '../knexfile';

global.db = knex(config);

global.db
  .raw('select current_database(), version()')
  .then(({ rows: [x] }) => {
    console.log('Connected to', x.current_database);
    console.log(x.version);
    repl.start('#> ').on('exit', process.exit);
  })
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });
