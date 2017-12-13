/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../node';
import StoryType from '../story/StoryType';
import UserType from '../user/UserType';
import type Context from '../../Context';

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField(),

    story: {
      type: new GraphQLNonNull(StoryType),
      resolve(parent, args, ctx: Context) {
        return ctx.storyById.load(parent.story_id);
      },
    },

    parent: {
      type: CommentType,
      resolve(parent, args, ctx: Context) {
        return parent.parent_id && ctx.commentById.load(parent.parent_id);
      },
    },

    author: {
      type: new GraphQLNonNull(UserType),
      resolve(parent, args, ctx: Context) {
        return ctx.userById.load(parent.author_id);
      },
    },

    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args, ctx: Context) {
        return ctx.commentsByParentId.load(parent.id);
      },
    },

    text: {
      type: GraphQLString,
    },

    pointsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(parent, args, ctx: Context) {
        return ctx.commentPointsCount.load(parent.id);
      },
    },

    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.created_at;
      },
    },

    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});

export default CommentType;
