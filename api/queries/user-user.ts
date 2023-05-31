/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { GraphQLFieldConfig, GraphQLString } from "graphql";
import { BadRequest, Forbidden, Unauthorized } from "http-errors";
import { Context, User } from "../core";
import { UserType } from "../types";

/**
 * @example
 *   query {
 *     user(email: "john@example.com") {
 *       id
 *       email
 *     }
 *   }
 */
export const user: GraphQLFieldConfig<User, Context> = {
  description: "Fetches a user account by username or email.",
  type: UserType,

  args: {
    email: { type: GraphQLString },
  },

  resolve(self, args, ctx) {
    if (args.email) {
      if (!ctx.token) {
        throw new Unauthorized();
      }

      if (!(args.email === ctx.token.email || ctx.token.admin)) {
        throw new Forbidden();
      }

      return ctx.auth.getUserByEmail(args.email);
    } else {
      throw new BadRequest("The email argument is required.");
    }
  },
};
