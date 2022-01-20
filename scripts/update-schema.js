/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import minimist from "minimist";

const args = minimist(process.argv.slice(2));
await import("envars").then((module) => module.config({ env: args.env }));
const { updateSchema } = await import("api/dist/index.js");

/**
 * Generates `schema.graphql` file from the actual GraphQL schema.
 */
updateSchema((err) => {
  if (err) {
    console.err(err);
    process.exit(1);
  }
});
