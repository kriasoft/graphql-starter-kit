/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import chalk from "chalk";
import knex from "knex";
import { updateTypes } from "knex-types";
import { createSpinner } from "nanospinner";
import { basename, join } from "node:path";
import config from "../knexfile.js";

/**
 * Generates TypeScript definitions from the database. Usage:
 *
 *   $ yarn db:update-types
 */
export default async function generateTypes() {
  await updateTypes(knex(config), {
    output: join(__dirname, "../types.ts"),
    overrides: {
      "identity_provider.github": "GitHub",
      "identity_provider.linkedin": "LinkedIn",
      "identity_provider.gamecenter": "GameCenter",
      "identity_provider.playgames": "PlayGames",
    },
    exclude: ["migration", "migration_lock"],
  });
}

if (basename(__filename) === "update-types.js") {
  const message = `Generating ${chalk.greenBright("db/types.ts")}...`;
  const spinner = createSpinner(message).start();

  try {
    await generateTypes();
    spinner.success();
  } catch (err) {
    process.exitCode = 1;
    spinner.error({ text: `${message}\n${err.stack}` });
  }
}
