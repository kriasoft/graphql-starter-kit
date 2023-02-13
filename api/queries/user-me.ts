/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { GraphQLFieldConfig } from "graphql";
import { Context, User } from "../core/index.js";
import { UserType } from "../types/index.js";

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
