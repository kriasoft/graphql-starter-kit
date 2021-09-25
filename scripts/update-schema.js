/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

const envars = require("envars");
const minimist = require("minimist");
require("api/utils/babel-register");

const args = minimist(process.argv.slice(2));
envars.config({ env: args.env, cwd: "../env" });

const { updateSchema } = require("api/graphql");

/**
 * Generates `schema.graphql` file from the actual GraphQL schema.
 */
updateSchema((err) => {
  if (err) {
    console.err(err);
    process.exit(1);
  }
});
