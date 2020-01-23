/**
 * Test data set (run `yarn db-seed --env=?`)
 * https://knexjs.org/#Seeds-API
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import Knex from 'knex';
import faker from 'faker';

export async function seed(db: Knex): Promise<void> {
  const users = Array.from({ length: 200 }).map(() => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    return [
      faker.internet.userName(firstName, lastName),
      faker.internet.email(firstName, lastName, 'example.com'),
      faker.name.findName(firstName, lastName),
      faker.internet.avatar(),
    ];
  });

  await db.raw(
    `
      INSERT INTO users (username, email, display_name, photo_url)
      VALUES ${users.map(() => '(?, ?, ?, ?)').join(', ')}
      ON CONFLICT DO NOTHING
    `,
    users.reduce((acc, v) => [...acc, ...v], []),
  );
}
