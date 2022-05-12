/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { GraphQLFieldConfig } from "graphql";
import {
  connectionFromArraySlice,
  cursorToOffset,
  forwardConnectionArgs,
} from "graphql-relay";
import { Forbidden } from "http-errors";
import { Context, db, User } from "../core";
import { UserConnection } from "../types";

/**
 * @example
 *   query {
 *     users(first: 10) {
 *       edges {
 *         user: node {
 *           id
 *           email
 *         }
 *       }
 *     }
 *   }
 */
export const users: GraphQLFieldConfig<unknown, Context> = {
  description: "Fetches user accounts.",
  type: UserConnection,
  args: forwardConnectionArgs,

  async resolve(root, args, ctx) {
    // Only admins are allowed to fetch the list of user accounts.
    if (!ctx.user?.admin) {
      throw new Forbidden();
    }

    const query = db.table<User>("user");

    const limit = args.first === undefined ? 50 : args.first;
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

    const data = await query
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy("created", "desc")
      .select();

    data.forEach((x) => {
      ctx.userById.prime(x.id, x);
      if (x.username) ctx.userByUsername.prime(x.username, x);
    });

    return {
      ...connectionFromArraySlice(data, args, {
        sliceStart: offset,
        arrayLength: offset + data.length,
      }),
      query,
    };
  },
};
