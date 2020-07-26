/**
 * GraphQL API context variables.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import DataLoader from "dataloader";
import { Request } from "express";

import db, { User } from "./db";
import { Validator } from "./validator";
import { mapTo, mapToMany, mapToValues } from "./utils";
import { UnauthorizedError, ForbiddenError, ValidationError } from "./errors";

export class Context {
  errors = [];
  private req: Request;

  constructor(req: Request) {
    this.req = req;

    // Add the currently logged in user object to the cache
    if (req.user) {
      this.userById.prime(req.user.id, req.user);
      this.userByUsername.prime(req.user.username, req.user);
    }
  }

  get user(): User | null {
    return this.req.user;
  }

  signIn(idToken: string): Promise<User | null> {
    return this.req.signIn(idToken);
  }

  signOut(): void {
    this.req.signOut();
  }

  /*
   * Authorization
   * ------------------------------------------------------------------------ */

  ensureAuthorized(check: (user: User) => boolean): void {
    if (!this.req.user) {
      throw new UnauthorizedError();
    }

    if (check && !check(this.req.user)) {
      throw new ForbiddenError();
    }
  }

  /*
   * Validation
   * ------------------------------------------------------------------------ */

  addError(key: string, message: string) {
    this.errors.push({ key, message });
  }

  validate(input: any, mode: "create" | "update") {
    const validator = new Validator(input, mode, (errors) => {
      throw new ValidationError(errors);
    });

    return (transform) => {
      transform(validator);
      return validator.validate();
    };
  }

  /*
   * Data loaders
   * ------------------------------------------------------------------------ */

  userById = new DataLoader((keys) =>
    db
      .table("users")
      .whereIn("id", keys as string[])
      .select()
      .then((rows: any[]) =>
        rows.map((x) => {
          this.userByUsername.prime(x.username, x);
          return x;
        }),
      )
      .then(mapTo(keys, (x: any) => x.id)),
  );

  userByUsername = new DataLoader((keys) =>
    db
      .table("users")
      .whereIn("username", keys as string[])
      .select()
      .then((rows) =>
        rows.map((x: any) => {
          this.userById.prime(x.id, x);
          return x;
        }),
      )
      .then(mapTo(keys, (x: any) => x.username)),
  );

  identitiesByUserId = new DataLoader((keys) =>
    db
      .table("user_identities")
      .whereIn("user_id", keys as string[])
      .select()
      .then(mapToMany(keys, (x: any) => x.user_id)),
  );

  storyById = new DataLoader((keys) =>
    db
      .table("stories")
      .whereIn("id", keys as string[])
      .select()
      .then((rows) => {
        rows.forEach((x: any) => this.storyBySlug.prime(x.slug, x));
        return rows;
      })
      .then(mapTo(keys, (x: any) => x.id)),
  );

  storyBySlug = new DataLoader((keys) =>
    db
      .table("stories")
      .whereIn("slug", keys as string[])
      .select()
      .then((rows: any[]) => {
        rows.forEach((x) => this.storyById.prime(x.id, x));
        return rows;
      })
      .then(mapTo(keys, (x: any) => x.slug)),
  );

  storyPointsCount = new DataLoader((keys) =>
    db
      .table("stories")
      .leftJoin("story_points", "story_points.story_id", "stories.id")
      .whereIn("stories.id", keys as string[])
      .groupBy("stories.id")
      .select("stories.id", db.raw("count(story_points.user_id)::int"))
      .then(
        mapToValues(
          keys,
          (x) => x.id,
          (x) => parseInt(x.count, 10),
        ),
      ),
  );

  storyPointGiven = new DataLoader((keys) => {
    const currentUser = this.user as any;
    const userId = currentUser && currentUser.id;

    return db
      .table("stories")
      .leftJoin("story_points", function join() {
        this.on("story_points.story_id", "stories.id").andOn(
          "story_points.user_id",
          db.raw("?", [userId]),
        );
      })
      .whereIn("stories.id", keys as string[])
      .select(
        "stories.id",
        db.raw("(story_points.user_id IS NOT NULL) AS given"),
      )
      .then(
        mapToValues(
          keys,
          (x) => x.id,
          (x) => x.given,
        ),
      );
  });
}
