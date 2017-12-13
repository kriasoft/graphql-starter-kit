/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import db from '../../db';
import validate from './validate';
import CommentType from './CommentType';
import { ValidationError } from '../../errors';
import type Context from '../../Context';

const inputFields = {
  storyId: {
    type: new GraphQLNonNull(GraphQLID),
  },
  parentId: {
    type: GraphQLID,
  },
  text: {
    type: GraphQLString,
  },
};

const outputFields = {
  story: {
    type: CommentType,
  },
};

const createComment = mutationWithClientMutationId({
  name: 'CreateComment',
  inputFields,
  outputFields,
  async mutateAndGetPayload(input, context: Context) {
    const { t, user, commentById } = context;
    const { data, errors } = validate(input, context);

    if (errors.length) {
      throw new ValidationError(errors);
    }

    const { type: storyType, id: storyId } = fromGlobalId(input.storyId);

    if (storyType !== 'Story') {
      throw new Error(t('The story ID is invalid.'));
    }

    if (typeof input.parentId !== 'undefined' && input.parentId !== '') {
      const { type: commentType, id: parentId } = fromGlobalId(input.parentId);
      if (commentType !== 'Comment') {
        throw new Error(t('The parent comment ID is invalid.'));
      }
      data.parent_id = parentId;
    }

    data.story_id = storyId;
    data.author_id = user.id;
    const rows = await db
      .table('comments')
      .insert(data)
      .returning('id');
    return commentById.load(rows[0]).then(comment => ({ comment }));
  },
});

const updateComment = mutationWithClientMutationId({
  name: 'UpdateComment',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    text: {
      type: GraphQLID,
    },
  },
  outputFields,
  async mutateAndGetPayload(input, ctx: Context) {
    const { t, user } = ctx;
    const { type, id } = fromGlobalId(input.id);

    if (type !== 'Comment') {
      throw new Error(t('The comment ID is invalid.'));
    }

    const { data, errors } = validate(input, ctx);
    const comment = await db
      .table('comments')
      .where('id', '=', id)
      .first('*');

    if (!comment) {
      errors.push({
        key: '',
        message: 'Failed to save the comment. Please make sure that it exists.',
      });
    } else if (comment.author_id !== user.id) {
      errors.push({ key: '', message: 'You can only edit your own comments.' });
    }

    if (errors.length) {
      throw new ValidationError(errors);
    }

    data.updated_at = db.raw('CURRENT_TIMESTAMP');

    await db
      .table('comments')
      .where('id', '=', id)
      .update(data);
    return ctx.commentById.load(id).then(x => ({ comment: x }));
  },
});

export default {
  createComment,
  updateComment,
};
