/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable global-require, no-console, no-confusing-arrow */

let db;
let app;
let redis;
let server;
let reload = Promise.resolve();

// Launch Node.js server
const launch = (callback) => {
  db = require('./db').default;
  app = require('./app').default;
  redis = require('./redis').default;
  server = app.listen(process.env.PORT, () => {
    console.log(`Node.js API server is listening on http://localhost:${String(process.env.PORT)}/`);
    if (callback) callback();
  });
};

// Shutdown Node.js server and database clients
const shutDown = () => Promise.resolve()
  .then(() => server && new Promise(resolve => server.close(resolve)))
  .then(() => Promise.all([
    () => db && db.destroy(),
    () => redis && new Promise(resolve => redis.quit(resolve)),
  ]));

const handleError = err => console.error(err.stack);

// Graceful shutdown
process.once('SIGTERM', () => shutDown().then(() => process.exit()));

// In development mode the app is launched with an IPC channel
if (process.channel) {
  // Prevent exiting the process in development mode
  process.on('uncaughtException', handleError);
  // Restart the server on code changes (see scripts/run.js)
  process.on('message', (message) => {
    if (message === 'reload') {
      reload = reload.then(() => shutDown()).then(() => {
        Object.keys(require.cache).forEach((key) => {
          if (key.indexOf('node_modules') === -1) delete require.cache[key];
        });
        return new Promise(resolve => launch(resolve)).catch(handleError);
      });
    }
  });
  process.on('disconnect', () => process.emit('SIGTERM'));
}

launch();
