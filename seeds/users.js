/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const faker = require('faker');

module.exports.seed = db =>
  // Create 10 random website users (as an example)
  Promise.all(Array.from({ length: 10 }).map(() => db.insert({
    email: faker.internet.email(),
  }).into('users')));
