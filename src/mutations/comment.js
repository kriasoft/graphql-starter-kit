/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import validator from 'validator';
import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import db from '../db';
import CommentType from '../types/CommentType';
import ValidationError from './ValidationError';

const outputFields = {
  story: {
    type: CommentType,
  },
};

function validate(input, { t, user }) {
  const errors = [];
  const data = {};

  if (!user) {
    throw new ValidationError([{ key: '', message: t('Only authenticated users can add comments.') }]);
  }

  if (typeof input.text === 'undefined' || input.text.trim() !== '') {
    errors.push({ key: 'text', message: t('The comment field cannot be empty.') });
  } else if (!validator.isLength(input.text, { min: 20, max: 2000 })) {
    errors.push({ key: 'text', message: t('The comment must be between 20 and 2000 characters long.') });
  } else {
    data.text = input.text;
  }

  return { data, errors };
}

const createComment = mutationWithClientMutationId({
  name: 'CreateComment',
  inputFields: {
    storyId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    parentId: {
      type: GraphQLID,
    },
    text: {
      type: GraphQLString,
    },
  },
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { t, user, comments } = context;
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
    const rows = await db.table('comments').insert(data).returning('id');
    return comments.load(rows[0]).then(comment => ({ comment }));
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
  async mutateAndGetPayload(input, context) {
    const { t, user, comments } = context;
    const { type, id } = fromGlobalId(input.id);

    if (type !== 'Comment') {
      throw new Error(t('The comment ID is invalid.'));
    }

    const { data, errors } = validate(input, context);
    const comment = await db.table('comments').where('id', '=', id).first('*');

    if (!comment) {
      errors.push({ key: '', message: 'Failed to save the comment. Please make sure that it exists.' });
    } else if (comment.author_id !== user.id) {
      errors.push({ key: '', message: 'You can only edit your own comments.' });
    }

    if (errors.length) {
      throw new ValidationError(errors);
    }

    data.updated_at = db.raw('CURRENT_TIMESTAMP');

    await db.table('comments').where('id', '=', id).update(data);
    await comments.clear(id);
    return comments.load(id).then(x => ({ comment: x }));
  },
});

export default {
  createComment,
  updateComment,
};
