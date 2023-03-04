/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { default as knex } from "knex";
import config from "./db-config.js";
import { createNewId } from "./utils.js";

/**
 * Knex.js database client and query builder for PostgreSQL.
 *
 * @see https://knexjs.org/
 */
const db = knex.knex(config);

// Extend `db.fn` with an additional functionality.
db.fn.constructor.prototype.newUserId = createNewId(db, "user", 6);

// Ensure that the database connections will be closed when
// the Node.js process is being shut down.
process.once("SIGTERM", function cleanup() {
  db.destroy();
});

export { db };
