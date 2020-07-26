/**
 * Authentication API endpoints (signIn, signOut).
 *
 * @see https://firebase.google.com/docs/auth/admin/manage-cookies
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import {
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { Context } from "../context";
import { UserType } from "../types";

type SignInArgs = {
  idToken: string;
};

export const signIn: GraphQLFieldConfig<unknown, Context, SignInArgs> = {
  description: "Authenticates user with a Firebase ID token.",

  type: new GraphQLObjectType({
    name: "SignInPayload",
    fields: {
      me: { type: UserType },
    },
  }),

  args: {
    idToken: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(self, args, ctx) {
    return { me: await ctx.signIn(args.idToken) };
  },
};

export const signOut: GraphQLFieldConfig<unknown, Context, unknown> = {
  description: "Removes the authentication cookie.",
  type: GraphQLString,

  resolve(self, args, ctx) {
    ctx.signOut();
  },
};
