/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { knex } from "knex";
import { updateTypes } from "knex-types";
import { createSpinner } from "nanospinner";
import { basename } from "node:path";
import { nextTick } from "node:process";
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
  const spinner = createSpinner("Generating db/types.ts...").start();
  generateTypes()
    .then(() => spinner.success())
    .catch((err) => {
      nextTick(() => console.error(err));
      process.exitCode = 1;
      spinner.error();
    });
}
