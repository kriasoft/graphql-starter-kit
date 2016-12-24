/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import app from './app';
import pool from './db/pool';

const server = app.listen(process.env.PORT, () => {
  process.stdout.write(`Node.js API server is listening on http://localhost:${String(process.env.PORT)}/\n`);
});

// Gracefull shutdown
process.once('SIGTERM', () => {
  let count = 2;
  pool.end().then(() => { count -= 1; if (count === 0) process.exit(0); });
  server.close(() => { count -= 1; if (count === 0) process.exit(0); });
});

export default server;
