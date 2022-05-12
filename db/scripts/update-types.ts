/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { knex } from "knex";
import { updateTypes } from "knex-types";
import { basename } from "node:path";
import { nextTick } from "node:process";
import { promise as oraPromise } from "ora";
import config from "../knexfile";

/**
 * Generates TypeScript definitions from the database. Usage:
 *
 *   $ yarn db:update-types
 */
export default async function generateTypes() {
  await updateTypes(knex(config), {
    output: "../db/types.ts",
    overrides: {
      "identity_provider.github": "GitHub",
      "identity_provider.linkedin": "LinkedIn",
      "identity_provider.gamecenter": "GameCenter",
      "identity_provider.playgames": "PlayGames",
    },
    exclude: ["migration", "migration_lock"],
  });
}

if (basename(process.argv[1]) === "update-types.ts") {
  oraPromise(
    generateTypes().catch((err) => {
      nextTick(() => console.error(err));
      process.exitCode = 1;
      return Promise.reject(err);
    }),
    { text: "Generating db/types.ts..." },
  );
}
