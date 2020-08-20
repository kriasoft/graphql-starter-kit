/**
 * The custom GraphQL type that represents a story comment.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { globalIdField } from "graphql-relay";
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";

import { Comment } from "../db";
import { UserType } from "./user";
import { nodeInterface } from "../node";
import { dateField } from "../fields";
import { Context } from "../context";

export const CommentType: GraphQLObjectType = new GraphQLObjectType<
  Comment,
  Context
>({
  name: "Comment",
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField(),

    parent: {
      type: CommentType,
      resolve(self, args, ctx) {
        return self.parent_id && ctx.commentById.load(self.parent_id);
      },
    },

    author: {
      type: new GraphQLNonNull(UserType),
      resolve(self, args, ctx) {
        return ctx.userById.load(self.author_id);
      },
    },

    text: {
      type: GraphQLString,
    },

    createdAt: dateField((self) => self.created_at),
    updatedAt: dateField((self) => self.updated_at),
  }),
});
