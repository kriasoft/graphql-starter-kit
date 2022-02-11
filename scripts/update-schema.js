/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import minimist from "minimist";

envars.config({ env: minimist(process.argv.slice(2)).env });
const { updateSchema } = await import("../api/dist/index.js");

/**
 * Generates `schema.graphql` file from the actual GraphQL schema.
 */
updateSchema().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
