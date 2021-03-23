/**
 * GraphQL API mutations related to user accounts.
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import type { User } from "db";
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { validate, ValidationError } from "validator-fluent";
import { Context } from "../context";
import db from "../db";
import { UserType } from "../types";
import { fromGlobalId } from "../utils";

type UpdateUserArgs = {
  input: {
    id: string;
    username?: string | null;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
    timeZone?: string | null;
    locale?: string | null;
  };
  dryRun: boolean;
};

export const updateUser: GraphQLFieldConfig<never, Context, UpdateUserArgs> = {
  description: "Updates the user account.",

  type: new GraphQLObjectType({
    name: "UpdateUserPayload",
    fields: {
      user: { type: UserType },
    },
  }),

  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: "UpdateUserInput",
        fields: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          username: { type: GraphQLString },
          email: { type: GraphQLString },
          name: { type: GraphQLString },
          picture: { type: GraphQLString },
          timeZone: { type: GraphQLString },
          locale: { type: GraphQLString },
        },
      }),
    },
    dryRun: { type: new GraphQLNonNull(GraphQLBoolean), defaultValue: false },
  },

  async resolve(self, { input, dryRun }, ctx) {
    const id = fromGlobalId(input.id, "User");

    // Check permissions
    ctx.ensureAuthorized((user) => user.id === id || user.admin);

    // Validate user inputs
    const [data, errors] = validate(input, (value) => ({
      username: value("username")
        .isLength({ min: 2, max: 50 })
        .is(
          (value) => /^[0-9a-zA-Z.]+$/.test(value),
          "Can only contain letters, digits, and a dot.",
        )
        .is(
          (value) => /^[^.].*[^.]$/.test(value),
          "Cannot start or end with a dot.",
        )
        .is((value) => /^[^0-9]/.test(value), "Cannot start with a digit."),
      email: value("email").isLength({ max: 100 }).isEmail(),
      name: value("name").isLength({ min: 2, max: 100 }),
      picture: value("picture").isLength({ max: 100 }),
      time_zone: value("timeZone").isLength({ max: 50 }),
      locale: value("locale").isLength({ max: 10 }),
    }));

    // Once a new username is provided and it passes the initial
    // validation, check if it's not used by any other user.
    if (input.username && !("username" in errors)) {
      const exists = await db
        .table<User>("user")
        .where({ username: input.username })
        .whereNot({ id })
        .first("id")
        .then((x) => Boolean(x));
      if (exists) {
        errors.username = ["Username is not available."];
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }

    if (Object.keys(data).length === 0) {
      throw new ValidationError({ _: ["The input values cannot be empty."] });
    }

    if (dryRun) {
      return { user: await ctx.userById.load(id) };
    }

    const [user] = await db
      .table("user")
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning("*");

    return { user };
  },
};
