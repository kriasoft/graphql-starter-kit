/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import faker from "@faker-js/faker";
import { type Knex } from "knex";
import nanoid from "nanoid";

// Short ID generator
// https://zelark.github.io/nano-id-cc/
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const newUserId = nanoid.customAlphabet(alphabet, 6);
const { date, image, internet, name, random } = faker;

/**
 * Seeds the database with test / reference user accounts.
 */
export async function seed(db: Knex) {
  let { default: records } = await import("./01_users.json");

  // Generates fake user accounts
  // https://github.com/faker-js/faker
  if (records.length === 0) {
    console.log("Generating fake user accounts...");
    const usernames = new Set();

    records = Array.from({ length: 200 }).map(() => {
      const id = newUserId();
      const gender = random.arrayElement(["male", "female"]);
      const firstName = name.firstName(gender);
      const lastName = name.lastName(gender);
      let username = `${firstName.toLowerCase()}${random.number(50)}`;
      const createdAt = date.recent(365);

      // Ensures that the username is unique
      while (usernames.has(username)) {
        username = `${firstName.toLowerCase()}${random.number(50)}`;
      }

      usernames.add(username);

      return {
        id,
        username,
        email: internet.email(firstName, lastName).toLowerCase(),
        name: `${firstName} ${lastName}`,
        given_name: firstName,
        family_name: lastName,
        picture: { url: image.avatar() },
        created: createdAt,
        updated: createdAt,
        last_login:
          Math.random() > 0.5
            ? date.between(createdAt.toString(), new Date().toString())
            : null,
      };
    }) as any; /* eslint-disable-line @typescript-eslint/no-explicit-any */
  }

  await db.table("user").insert(records).onConflict(["id"]).ignore();
}
