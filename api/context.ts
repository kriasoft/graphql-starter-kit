/**
 * GraphQL API context variables.
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import DataLoader from "dataloader";
import type { Identity, User } from "db";
import { Request } from "express";
import db from "./db";
import { ForbiddenError, UnauthorizedError } from "./error";
import { mapTo, mapToMany } from "./utils";

export class Context {
  private readonly req: Request;

  constructor(req: Request) {
    this.req = req;

    // Add the currently logged in user object to the cache
    if (req.user) {
      this.userById.prime(req.user.id, req.user);
      this.userByUsername.prime(req.user.username, req.user);
    }
  }

  /*
   * Authentication and authorization
   * ------------------------------------------------------------------------ */

  get user(): User | null {
    return this.req.user;
  }

  signIn(user: User | null | undefined): Promise<User | null> {
    return this.req.signIn(user);
  }

  signOut(): void {
    this.req.signOut();
  }

  ensureAuthorized(check?: (user: User) => boolean): void {
    if (!this.req.user) {
      throw new UnauthorizedError();
    }

    if (check && !check(this.req.user)) {
      throw new ForbiddenError();
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
      .then((rows) =>
        rows.map((x) => {
          this.userByUsername.prime(x.username, x);
          return x;
        }),
      )
      .then((rows) => mapTo(rows, keys, (x) => x.id)),
  );

  userByUsername = new DataLoader<string, User | null>((keys) =>
    db
      .table<User>("user")
      .whereIn("username", keys)
      .select()
      .then((rows) =>
        rows.map((x) => {
          this.userById.prime(x.id, x);
          return x;
        }),
      )
      .then((rows) => mapTo(rows, keys, (x) => x.username)),
  );

  identitiesByUserId = new DataLoader<string, Identity[]>((keys) =>
    db
      .table<Identity>("identity")
      .whereIn("user_id", keys)
      .select()
      .then((rows) => mapToMany(rows, keys, (x) => x.user_id)),
  );
}
