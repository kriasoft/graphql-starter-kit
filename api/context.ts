/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import DataLoader from "dataloader";
import { Request } from "express";
import { Forbidden, Unauthorized } from "http-errors";
import { User } from "../db/types.js";
import { db } from "./core/db.js";
import { GraphQLParams } from "./core/helix.js";
import { log, LogSeverity } from "./core/logging.js";
import { mapTo } from "./utils/map.js";

/**
 * GraphQL execution context.
 * @see https://graphql.org/learn/execution/
 */
export class Context extends Map<symbol, unknown> {
  readonly req: Request;
  readonly params: GraphQLParams;

  constructor(req: Request, params: GraphQLParams) {
    super();
    this.req = req;
    this.params = params;

    // Add the currently logged in user object to the cache
    if (this.req.user) {
      this.userById.prime(this.req.user.id, this.req.user);
    }
  }

  log(
    severity: LogSeverity,
    data: string | Record<string, unknown> | Error,
  ): void {
    log(this.req, severity, data, this.params);
  }

  /*
   * Authentication and authorization
   * ------------------------------------------------------------------------ */

  get user(): User | null {
    return this.req.user;
  }

  ensureAuthorized(check?: (user: User) => boolean): void {
    if (!this.req.user) {
      throw new Unauthorized();
    }

    if (check && !check(this.req.user)) {
      throw new Forbidden();
    }
  }

  /*
   * Data loaders
   * ------------------------------------------------------------------------ */

  userById = new DataLoader<string, User | null>((keys) =>
    db
      .table<User>("user")
      .whereIn("id", keys)
      .select()
      .then((rows) => mapTo(rows, keys, (x) => x.id)),
  );
}
