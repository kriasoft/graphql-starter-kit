/**
 * The top-level GraphQL API query fields related to user accounts.
 *
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import type { User } from "db";
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from "graphql";
import {
  connectionDefinitions,
  connectionFromArraySlice,
  cursorToOffset,
  forwardConnectionArgs,
} from "graphql-relay";
import { Context } from "../context";
import db from "../db";
import { countField } from "../fields";
import { UserType } from "../types";

export const me: GraphQLFieldConfig<unknown, Context> = {
  type: UserType,

  resolve(root, args, ctx) {
    return ctx.user ? ctx.userById.load(ctx.user.id) : null;
  },
};

export const user: GraphQLFieldConfig<unknown, Context> = {
  type: UserType,

  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },

  resolve(root, { username }, ctx) {
    return ctx.userByUsername.load(username);
  },
};

export const users: GraphQLFieldConfig<unknown, Context> = {
  type: connectionDefinitions({
    name: "User",
    nodeType: UserType,
    connectionFields: { totalCount: countField },
  }).connectionType,

  args: forwardConnectionArgs,

  async resolve(root, args, ctx) {
    // Only admins are allowed to fetch the list of users
    ctx.ensureAuthorized((user) => user.admin);

    const query = db.table<User>("user");

    const limit = args.first === undefined ? 50 : args.first;
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

    const data = await query
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy("created_at", "desc")
      .select();

    data.forEach((x) => {
      ctx.userById.prime(x.id, x);
      ctx.userByUsername.prime(x.username, x);
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
