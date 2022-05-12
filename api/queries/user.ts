/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { GraphQLFieldConfig, GraphQLString } from "graphql";
import { Context, db, User } from "../core";
import { UserType } from "../types";

/**
 * @example
 *   query {
 *     user(username: "john") {
 *       id
 *       email
 *     }
 *   }
 */
export const user: GraphQLFieldConfig<User, Context> = {
  description: "Fetches a user account by username or email.",
  type: UserType,

  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },

  resolve(self, args, ctx) {
    const query = db.table<User>("user");

    if (args.username) {
      query.where("username", "=", args.username);
    } else if (args.email) {
      ctx.ensureAuthorized();
      query.where("email", "=", args.email);
    } else {
      throw new Error("The username argument is required.");
    }

    return query.first();
  },
};
