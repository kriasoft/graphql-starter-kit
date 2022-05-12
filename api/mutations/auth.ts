/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import argon2 from "argon2";
import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { Context, db, User } from "../core";
import { UserType } from "../types";
import { validate, ValidationError } from "../utils";

/**
 * @example
 *   mutation {
 *     signIn(input: { username: "user@email.com", password: "xxx" }) {
 *       user {
 *         id
 *         email
 *       }
 *     }
 *   }
 */
export const signIn: GraphQLFieldConfig<unknown, Context> = {
  description: "Creates an authentication session",

  type: new GraphQLObjectType({
    name: "SignInPayload",
    fields: {
      user: { type: UserType },
    },
  }),

  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: "SignInInput",
        fields: {
          username: { type: GraphQLString, description: "Username or email" },
          password: { type: GraphQLString, description: "User's password" },
        },
      }),
    },
  },

  async resolve(self, args, ctx) {
    const input: SignInInput = args.input;

    // Validate user input
    const [data, errors] = validate(input, (value) => ({
      username: value("username").notEmpty().isLength({ max: 50 }),
      password: value("password").notEmpty().isLength({ max: 50 }),
    }));

    // Throw an error if validation fails
    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }

    // Find user(s) by username or email
    const login = input.username?.includes("@") ? "email" : "username";
    const query = db.table<User>("user");

    // NOTE: There can be more than one account with the same email
    if (login === "email") {
      query.where("email", "=", input.username as string);
      query.orderBy("email_verified", "desc");
      query.orderBy("created", "desc");
    } else {
      query.where("username", "=", input.username as string);
    }

    const users = await query.select();

    for (const user of users) {
      if (user.password) {
        if (await argon2.verify(user.password, data.password as string)) {
          // If password verification succeeded, create an authentication
          // session and return the currently logged in user object.
          return { user: await ctx.signIn(user) };
        }
      }
    }

    // Otherwise, throw a password validation error
    throw new ValidationError({ password: [`Invalid ${login} or password.`] });
  },
};

export const signOut: GraphQLFieldConfig<unknown, Context> = {
  description: "Clears authentication session",
  type: GraphQLString,

  resolve(self, args, ctx) {
    ctx.signOut();
  },
};

type SignInInput = {
  username?: string | null;
  password?: string | null;
};
