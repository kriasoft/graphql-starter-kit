/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

const { knex } = require("knex");
const { updateTypes } = require("knex-types");
const config = require("../knexfile");

module.exports = () =>
  updateTypes(knex(config), {
    output: "../db/types.ts",
    overrides: {
      "identity_provider.github": "GitHub",
      "identity_provider.linkedin": "LinkedIn",
      "identity_provider.gamecenter": "GameCenter",
      "identity_provider.playgames": "PlayGames",
    },
    exclude: ["migration", "migration_lock"],
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });

if (require.main.filename === __filename) {
  module.exports().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
