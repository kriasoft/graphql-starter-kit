/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { GraphQLFieldConfig } from "graphql";
import { Context, User } from "../core";
import { UserType } from "../types";

/**
 * @example
 *   query {
 *     me {
 *       id
 *       email
 *     }
 *   }
 */
export const me: GraphQLFieldConfig<User, Context> = {
  description: "The authenticated user.",
  type: UserType,

  resolve(self, args, ctx) {
    return ctx.user;
  },
};
