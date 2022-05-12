/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { BadRequest } from "http-errors";
import { Context, db, User } from "../core";
import { UserType } from "../types";
import { fromGlobalId, validate, ValidationError } from "../utils";

type UpdateUserInput = {
  id: string;
  username?: string | null;
  email?: string | null;
  name?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  timeZone?: string | null;
  locale?: string | null;
};

/**
 * @example
 *   mutation {
 *     updateUser(input: { id: "xxx", email: "new@email.com" }, dryRun: false) {
 *       user {
 *         id
 *         email
 *       }
 *     }
 *   }
 */
export const updateUser: GraphQLFieldConfig<unknown, Context> = {
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
          givenName: { type: GraphQLString },
          familyName: { type: GraphQLString },
          timeZone: { type: GraphQLString },
          locale: { type: GraphQLString },
        },
      }),
    },
    dryRun: { type: new GraphQLNonNull(GraphQLBoolean), defaultValue: false },
  },

  async resolve(self, args, ctx) {
    const input = args.input as UpdateUserInput;
    const dryRun = args.dryRun as boolean;
    const id = fromGlobalId(input.id, "User");

    // Check permissions
    ctx.ensureAuthorized((user) => user.id === id || user.admin);

    // Validate and sanitize user input
    const [data, errors] = validate(input, (value) => ({
      username: value("username").isUsername(),
      email: value("email").isLength({ max: 100 }).isEmail(),
      name: value("name").isLength({ min: 2, max: 50 }),
      given_name: value("givenName").isLength({ min: 2, max: 50 }),
      family_name: value("familyName").isLength({ min: 1, max: 50 }),
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
      throw new BadRequest("The input cannot be empty.");
    }

    if (dryRun) {
      return { user: await ctx.userById.load(id) };
    }

    const [user] = await db
      .table("user")
      .where({ id })
      .update({ ...data, updated: db.fn.now() })
      .returning("*");

    return { user };
  },
};
