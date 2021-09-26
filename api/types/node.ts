/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { GraphQLObjectType } from "graphql";
import { fromGlobalId, nodeDefinitions } from "graphql-relay";
import { Context } from "../context";

/**
 * The Node interface.
 * https://relay.dev/graphql/objectidentification.htm
 */
export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  (globalId, ctx: Context) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
      case "User":
        return ctx.userById.load(id);
      case "Instructor":
        return ctx.instructorById.load(id);
      case "Class":
        return ctx.classById.load(id);
      case "Team":
        return ctx.teamById.load(id);
      case "Session":
        return ctx.sessionById.load(id);
      default:
        return null;
    }
  },
  async (obj): Promise<GraphQLObjectType | null> => {
    const type = await import(".");

    if (obj.email !== undefined) return type.UserType;
    if (obj.display_name !== undefined) return type.InstructorType;
    if (obj.published_at !== undefined) return type.ClassType;
    if (obj.class_id !== undefined) return type.SessionType;
    if (obj.creator_id !== undefined) return type.TeamType;

    return null;
  },
);
