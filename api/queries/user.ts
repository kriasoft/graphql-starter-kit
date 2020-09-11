/**
 * The top-level GraphQL API query fields related to user accounts.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { GraphQLNonNull, GraphQLString, GraphQLFieldConfig } from "graphql";
import {
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from "graphql-relay";
import type { User } from "db";

import db from "../db";
import { Context } from "../context";
import { UserType } from "../types";
import { countField } from "../fields";

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

    const query = db.table<User>("users");

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
