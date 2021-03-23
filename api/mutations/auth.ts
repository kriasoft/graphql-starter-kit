/**
 * Authentication API endpoints (signIn, signOut).
 *
 * @see https://firebase.google.com/docs/auth/admin/manage-cookies
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import bcrypt from "bcrypt";
import type { User } from "db";
import { GraphQLFieldConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { validate, ValidationError } from "validator-fluent";
import { Context } from "../context";
import db from "../db";
import { UserType } from "../types";

interface SignInArgs {
  idToken?: string;
  email?: string;
  password?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signIn: GraphQLFieldConfig<unknown, Context, any> = {
  description: "Authenticates user with an ID token or email and password.",

  type: new GraphQLObjectType({
    name: "SignInPayload",
    fields: {
      me: { type: UserType },
    },
  }),

  args: {
    idToken: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },

  async resolve(self, args: SignInArgs, ctx) {
    if (args.idToken) {
      // TODO: Authenticate user with the provided (Firebase) ID token.
      throw new Error("Not implemented.");
    }

    // Validate user input for email/password authentication
    const [input, errors] = validate(args, (value) => ({
      email: value("email").notEmpty().isEmail(),
      password: value("password").notEmpty(),
    }));

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }

    const users = await db
      .table<User>("user")
      .where("email", "=", String(input.email))
      .whereNotNull("password")
      .orderBy("email_verified", "desc")
      .select();

    for (const user of users) {
      const valid = await bcrypt.compare(input.password, String(user.password));

      if (valid) {
        const me = await ctx.signIn(user);
        return { me };
      }
    }

    // TODO: Log failed login attempts.
    throw new ValidationError({ password: ["Wrong email or password."] });
  },
};

export const signOut: GraphQLFieldConfig<unknown, Context> = {
  description: "Removes the authentication cookie.",
  type: GraphQLString,

  resolve(self, args, ctx) {
    ctx.signOut();
  },
};
