/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import argon2 from "argon2";
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { Context, db, User } from "../core";
import { UserType } from "../types";
import { validate, ValidationError } from "../utils";

type CreateUserInput = {
  username?: string | null;
  email?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  timeZone?: string | null;
  locale?: string | null;
  signIn: boolean;
};

/**
 * @example
 *   mutation {
 *     createUser(input: { email: "user@email.com" }, dryRun: false) {
 *       user {
 *         id
 *         email
 *       }
 *     }
 *   }
 */
export const createUser: GraphQLFieldConfig<unknown, Context> = {
  description: "Creates a new user account",

  type: new GraphQLObjectType({
    name: "CreateUserPayload",
    fields: {
      user: { type: UserType },
    },
  }),

  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: "CreateUserInput",
        fields: {
          username: { type: GraphQLString },
          email: { type: GraphQLString },
          password: { type: GraphQLString },
          firstName: { type: GraphQLString },
          lastName: { type: GraphQLString },
          timeZone: { type: GraphQLString },
          locale: { type: GraphQLString },
          signIn: { type: GraphQLBoolean, defaultValue: false },
        },
      }),
    },
    dryRun: { type: new GraphQLNonNull(GraphQLBoolean), defaultValue: false },
  },

  async resolve(self, args, ctx) {
    const input = args.input as CreateUserInput;
    const dryRun = args.dryRun as boolean;

    // Validate and sanitize user input
    const [data, errors] = validate(input, (value) => ({
      username: value("username").notEmpty().isUsername(),
      email: value("email").notEmpty().isLength({ max: 100 }).isEmail(),
      password: value("password").notEmpty().isLength({ min: 8, max: 50 }),
      first_name: value("firstName").notEmpty().isLength({ min: 2, max: 50 }),
      last_name: value("lastName").notEmpty().isLength({ min: 1, max: 50 }),
      time_zone: value("timeZone").isLength({ max: 50 }),
      locale: value("locale").isLength({ max: 10 }),
    }));

    // Once a new username is provided and it passes the initial
    // validation, check if it's not used by any other user.
    if (!("username" in errors)) {
      const exists = await db
        .table<User>("user")
        .where({ username: input.username as string })
        .first("id")
        .then((x) => Boolean(x));
      if (exists) {
        errors.username = ["Username is not available."];
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }

    if (dryRun) return { user: null };

    data.password = await argon2.hash(data.password as string);

    const id = await db.fn.newUserId();
    let [user] = await db
      .table("user")
      .insert({ id, ...data })
      .returning("*");

    if (user && input.signIn) {
      user = await ctx.signIn(user);
    }

    return { user };
  },
};
