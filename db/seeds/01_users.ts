/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import faker from "@faker-js/faker";
import { type Knex } from "knex";
import nanoid from "nanoid";
import fs from "node:fs/promises";
import prettier from "prettier";

// Short ID generator
// https://zelark.github.io/nano-id-cc/
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const newUserId = nanoid.customAlphabet(alphabet, 6);
const { date, image, internet, name, random } = faker;

function stringify(obj: Record<string, unknown>) {
  return prettier.format(JSON.stringify(obj), { parser: "json" });
}

/**
 * Seeds the database with test / reference user accounts.
 */
export async function seed(db: Knex) {
  const jsonFile = __filename.replace(/\.\w+$/, ".json");
  let users = JSON.parse(await fs.readFile(jsonFile, "utf-8"));

  // Generates fake user accounts
  // https://github.com/marak/Faker.js
  if (users.length === 0) {
    console.log("Generating users.json...");
    const usernames = new Set();

    users = Array.from({ length: 200 }).map(() => {
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
    });

    await fs.writeFile(jsonFile, stringify(users));
  }

  await db.table("user").insert(users).onConflict(["id"]).ignore();
}
