/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable no-restricted-syntax, no-await-in-loop */

const faker = require('faker');

module.exports.seed = async (db) => {
  // Create 10 random website users (as an example)
  const users = Array.from({ length: 10 }).map(() => ({
    email: faker.internet.email(),
  }));

  await Promise.all(users.map(user =>
    db.table('users').insert(user).returning('id')
      .then(rows => db.table('users').where('id', '=', rows[0]).first('*'))
      .then(row => Object.assign(user, row))));

  // Create 500 stories
  const stories = Array.from({ length: 500 }).map(() => Object.assign(
    {
      author_id: users[Math.floor(Math.random() * users.length)].id,
      title: faker.name.title(),
    },
    Math.random() > 0.3 ? { text: faker.lorem.text() } : { url: faker.internet.url() },
    (date => ({ created_at: date, updated_at: date }))(faker.date.past())));

  await Promise.all(stories.map(story =>
    db.table('stories').insert(story).returning('id')
      .then(rows => db.table('stories').where('id', '=', rows[0]).first('*'))
      .then(row => Object.assign(story, row))));
};
