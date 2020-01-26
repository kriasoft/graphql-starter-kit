/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');
const graphql = require('graphql');
const schema = require('../src/schema').default;
const db = require('../src/db').default;

fs.writeFileSync(
  path.resolve(__dirname, '../schema.graphql'),
  graphql.printSchema(schema, { commentDescriptions: true }),
  'utf8',
);

db.destroy();
