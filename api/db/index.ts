/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import knex from "knex";
import config from "./config";
import { createNewId } from "./utils";
export * from "../../db/types";

/**
 * Knex.js database client and query builder for PostgreSQL.
 *
 * @see https://knexjs.org/
 */
const db = knex(config);

// Extend `db.fn` with an additional functionality.
db.fn.constructor.prototype.newUserId = createNewId(db, "user", 6);
db.fn.constructor.prototype.newTeamId = createNewId(db, "team", 6);
db.fn.constructor.prototype.newClassId = createNewId(db, "class", 6);
db.fn.constructor.prototype.newSessionId = createNewId(db, "session", 7);
db.fn.constructor.prototype.newPostId = createNewId(db, "post", 8);
db.fn.constructor.prototype.newCommentId = createNewId(db, "comment", 8);

// Ensure that the database connections will be closed when
// the Node.js process is being shut down.
process.once("SIGTERM", function () {
  db.destroy();
});

export default db;
