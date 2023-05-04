/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { faker } from "@faker-js/faker";
import knex from "knex";
import { createSpinner } from "nanospinner";
import config from "../knexfile.js";

/**
 * Generates fake (but reasonable) data that can be used for things such as:
 *   - Unit testing
 *   - Performance testing
 *   - Building demos
 *
 * Usage example:
 *
 *   $ yarn db:generate [--env #0]
 *
 * @see https://fakerjs.dev/guide/
 */

const { date, image, internet, name, random } = faker;

function newUserId() {
  return `${Math.floor(Math.random() * 89999999 + 10000000)}`;
}

const db = knex(config);

try {
  const spinner = createSpinner("Generating fake user accounts...").start();
  const users = [];
  const usernames = new Set();

  for (let i = 0; i < 100; i++) {
    const id = newUserId();
    const gender = name.sex();
    const firstName = name.firstName(gender);
    const lastName = name.lastName(gender);
    let username = `${firstName.toLowerCase()}${random.numeric(2)}`;
    const createdAt = date.recent(365);

    // Ensures that the username is unique
    while (usernames.has(username)) {
      username = `${firstName.toLowerCase()}${random.numeric(2)}`;
    }

    usernames.add(username);

    users.push({
      id,
      email: internet.email(firstName, lastName).toLowerCase(),
      name: `${firstName} ${lastName}`,
      picture: { url: image.avatar() },
      created: createdAt,
      updated: createdAt,
      last_login:
        Math.random() > 0.5
          ? date.between(createdAt.toString(), new Date().toString())
          : null,
    });
  }

  await db.table("user").insert(users).onConflict(["id"]).ignore();

  spinner.success();
} finally {
  db?.destroy();
}
