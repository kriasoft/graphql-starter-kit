/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import { truncate } from 'lodash';
import { globalIdField } from 'graphql-relay';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import { UserType } from './user';
import { CommentType } from './comment';
import { nodeInterface } from '../node';
import { dateField } from '../fields';
import { Context } from '../context';

export const StoryType = new GraphQLObjectType<any, Context, any>({
  name: 'Story',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    author: {
      type: new GraphQLNonNull(UserType),
      resolve(self, args, ctx) {
        return ctx.userById.load(self.author_id);
      },
    },

    slug: {
      type: new GraphQLNonNull(GraphQLString),
    },

    title: {
      type: new GraphQLNonNull(GraphQLString),
    },

    text: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        truncate: { type: GraphQLInt },
      },
      resolve(self, args) {
        return args.truncate
          ? truncate(self.text, { length: args.truncate })
          : self.text;
      },
    },

    isURL: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve(self) {
        return self.is_url;
      },
    },

    comments: {
      type: new GraphQLList(CommentType),
      resolve(self, args, ctx) {
        return ctx.commentsByStoryId.load(self.id);
      },
    },

    pointsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(self, args, ctx) {
        return ctx.storyPointsCount.load(self.id);
      },
    },

    pointGiven: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve(self, args, ctx) {
        return ctx.user ? ctx.storyPointGiven.load(self.id) : false;
      },
    },

    commentsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(self, args, ctx) {
        return ctx.storyCommentsCount.load(self.id);
      },
    },

    createdAt: dateField((self: any) => self.created_at),
    updatedAt: dateField((self: any) => self.updated_at),
  },
});
