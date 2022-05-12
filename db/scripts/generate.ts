/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import faker, { GenderType } from "@faker-js/faker";
import envars from "envars";
import minimist from "minimist";
import ora from "ora";
import { db } from "../../api/core/db";
import { User } from "../types";

const { date, image, internet, name, random } = faker;
const args = minimist(process.argv.slice(2));

// Load environment variables (PGHOST, PGUSER, etc.)
envars.config({ env: args.env ?? "local" });

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
async function generate(): Promise<void> {
  const spinner = ora("Generating fake user accounts...");
  const users: Partial<User>[] = [];
  const usernames = new Set();

  for (let i = 0; i < 100; i++) {
    const id = await db.fn.newUserId();
    const gender = name.gender(true) as GenderType;
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
    });
  }

  await db.table("user").insert(users).onConflict(["id"]).ignore();

  spinner.succeed();
}

generate()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
