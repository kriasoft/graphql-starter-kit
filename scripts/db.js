/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const fs = require('fs');
const cp = require('child_process');
const knex = require('knex');
const task = require('./lib/task');
const { databaseUrl } = require('../src/config');

const command = process.argv[2];
const commands = ['create', 'drop', 'version', 'migrate', 'migrate:undo', 'migration', 'seed'];

const config = {
  client: 'pg',
  connection: databaseUrl,
  migrations: {
    tableName: 'migrations',
  },
};

const version = new Date().toISOString().substr(0, 16).replace(/\D/g, '');
const template = `module.exports.up = async (db) => {\n  \n};\n
module.exports.down = async (db) => {\n  \n};\n
module.exports.configuration = { transaction: true };\n`;

module.exports = task(async () => {
  let db;

  if (!commands.includes(command)) {
    throw new Error(`Unknown command: ${command}`);
  }

  try {
    switch (command) {
      case 'create':
      case 'drop': {
        db = knex(config);
        const conn = db.client.config.connection;
        await db.destroy();
        await new Promise((resolve) => {
          cp.spawn(command === 'create' ? 'createdb' : 'dropdb', [
            '-h', conn.host,
            '-p', conn.port,
            '-U', conn.user,
            conn.password ? '-W' : '-w',
            conn.database,
          ], { stdio: 'inherit' }).on('exit', resolve);
        });
        break;
      }
      case 'migration':
        fs.writeFileSync(`migrations/${version}_${process.argv[3] || 'new'}.js`, template, 'utf8');
        break;
      case 'migrate:undo':
        db = knex(config);
        await db.migrate.rollback(config);
        break;
      case 'version':
        db = knex(config);
        await db.migrate.currentVersion(config).then(console.log);
        break;
      case 'seed':
        console.error('Not yet implemented.');
        break;
      default:
        db = knex(config);
        await db.migrate.latest(config);
    }
  } finally {
    if (db) {
      await db.destroy();
    }
  }
});
