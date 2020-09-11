/**
 * GraphQL API context variables.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import DataLoader from "dataloader";
import { Request } from "express";
import type { User, Identity } from "db";

import db from "./db";
import { mapTo, mapToMany } from "./utils";
import { UnauthorizedError, ForbiddenError } from "./error";

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
      .table<User>("users")
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
      .table<User>("users")
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
      .table<Identity>("identities")
      .whereIn("user_id", keys)
      .select()
      .then((rows) => mapToMany(rows, keys, (x) => x.user_id)),
  );
}
