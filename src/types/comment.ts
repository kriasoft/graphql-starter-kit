/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import { globalIdField } from 'graphql-relay';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import { UserType } from './user';
import { nodeInterface } from '../node';
import { dateField } from '../fields';
import { Context } from '../context';

export const CommentType: GraphQLObjectType = new GraphQLObjectType<any, Context, any>({
  name: 'Comment',
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

    comments: {
      type: new GraphQLList(CommentType),
      resolve(self, args, ctx) {
        return ctx.commentsByParentId.load(self.id);
      },
    },

    text: {
      type: GraphQLString,
    },

    pointsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(self, args, ctx) {
        return ctx.commentPointsCount.load(self.id);
      },
    },

    createdAt: dateField((self: any) => self.created_at),
    updatedAt: dateField((self: any) => self.updated_at),
  }),
});
