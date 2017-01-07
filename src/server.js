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
import db from './db';
import redis from './redis';

const server = app.listen(process.env.PORT, () => {
  process.stdout.write(`Node.js API server is listening on http://localhost:${String(process.env.PORT)}/\n`);
});

// Graceful shutdown
process.once('SIGTERM', () => {
  server.close(() => db.destroy(() => redis.quit(() => process.exit())));
});

export default server;
