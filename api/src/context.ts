/**
 * GraphQL API context variables.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import DataLoader from "dataloader";
import { Request } from "express";

import db, { User, Story, Comment } from "./db";
import { Validator } from "./validator";
import { mapTo, mapToMany, mapToValues } from "./utils";
import { UnauthorizedError, ForbiddenError, ValidationError } from "./error";

export class Context {
  readonly errors: Array<{ key: string; message: string }> = [];
  private readonly req: Request;

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

  ensureAuthorized(check?: (user: User) => boolean): void {
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

  addError(key: string, message: string): void {
    this.errors.push({ key, message });
  }

  validate<Input>(
    input: Input,
    config?: (validator: Validator<Input>) => Validator<Input>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, any> | undefined {
    if (config) {
      const { data, errors } = config(new Validator(input));
      errors.forEach((err) => this.addError(err.key, err.message));
      this.errors.push(...errors);

      if (this.errors.length > 0) {
        throw new ValidationError(this.errors);
      }

      return data;
    }

    if (this.errors.length) {
      throw new ValidationError(this.errors);
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

  storyById = new DataLoader<string, Story | null>((keys) =>
    db
      .table<Story>("stories")
      .whereIn("id", keys)
      .select()
      .then((rows) => {
        rows.forEach((x) => this.storyBySlug.prime(x.slug, x));
        return rows;
      })
      .then((rows) => mapTo(rows, keys, (x) => x.id)),
  );

  storyBySlug = new DataLoader<string, Story | null>((keys) =>
    db
      .table<Story>("stories")
      .whereIn("slug", keys)
      .select()
      .then((rows) => {
        rows.forEach((x) => this.storyById.prime(x.id, x));
        return rows;
      })
      .then((rows) => mapTo(rows, keys, (x) => x.slug)),
  );

  storyCommentsCount = new DataLoader<string, number>((keys) =>
    db
      .table<Comment>("comments")
      .whereIn("story_id", keys)
      .groupBy("story_id")
      .select<{ story_id: string; count: string }[]>(
        "story_id",
        db.raw("count(story_id)"),
      )
      .then((rows) =>
        mapToValues(
          rows,
          keys,
          (x) => x.story_id,
          (x) => (x ? Number(x.count) : 0),
        ),
      ),
  );

  storyPointsCount = new DataLoader<string, number>((keys) =>
    db
      .table("stories")
      .leftJoin("story_points", "story_points.story_id", "stories.id")
      .whereIn("stories.id", keys)
      .groupBy("stories.id")
      .select("stories.id", db.raw("count(story_points.user_id)::int"))
      .then((rows) =>
        mapToValues(
          rows,
          keys,
          (x) => x.id,
          (x) => (x ? parseInt(x.count, 10) : 0),
        ),
      ),
  );

  storyPointGiven = new DataLoader<string, boolean>((keys) => {
    const currentUser = this.user;
    const userId = currentUser ? currentUser.id : "";

    return db
      .table("stories")
      .leftJoin("story_points", function join() {
        this.on("story_points.story_id", "stories.id").andOn(
          "story_points.user_id",
          db.raw("?", [userId]),
        );
      })
      .whereIn("stories.id", keys)
      .select<{ id: string; given: boolean }[]>(
        "stories.id",
        db.raw("(story_points.user_id IS NOT NULL) AS given"),
      )
      .then((rows) =>
        mapToValues(
          rows,
          keys,
          (x) => x.id,
          (x) => x?.given || false,
        ),
      );
  });

  commentById = new DataLoader<string, Comment | null>((keys) =>
    db
      .table<Comment>("comments")
      .whereIn("id", keys)
      .select()
      .then((rows) => mapTo(rows, keys, (x) => x.id)),
  );

  commentsByStoryId = new DataLoader<string, Comment[]>((keys) =>
    db
      .table<Comment>("comments")
      .whereIn("story_id", keys)
      .select()
      .then((rows) => mapToMany(rows, keys, (x) => x.story_id)),
  );
}
