/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import knex from "knex";
import config from "./dbConfig";
import { createNewId } from "./utils";

/**
 * Knex.js database client and query builder for PostgreSQL.
 *
 * @see https://knexjs.org/
 */
const db = knex(config);

// Extend `db.fn` with an additional functionality.
db.fn.constructor.prototype.newUserId = createNewId(db, "user", 6);

// Ensure that the database connections will be closed when
// the Node.js process is being shut down.
process.once("SIGTERM", function () {
  db.destroy();
});

export { db };
