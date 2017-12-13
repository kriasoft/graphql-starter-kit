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
import StoryType from './StoryType';
import { ValidationError } from '../../errors';
import type Context from '../../Context';

const inputFields = {
  title: {
    type: GraphQLString,
  },
  text: {
    type: GraphQLString,
  },
  url: {
    type: GraphQLString,
  },
};

const outputFields = {
  story: {
    type: StoryType,
  },
};

const createStory = mutationWithClientMutationId({
  name: 'CreateStory',
  inputFields,
  outputFields,
  async mutateAndGetPayload(input: any, ctx: Context) {
    const { data, errors } = validate(input, ctx);

    if (errors.length) {
      throw new ValidationError(errors);
    }

    const rows = await db
      .table('stories')
      .insert(data)
      .returning('id');
    return ctx.storyById.load(rows[0]).then(story => ({ story }));
  },
});

const updateStory = mutationWithClientMutationId({
  name: 'UpdateStory',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    ...inputFields,
  },
  outputFields,
  async mutateAndGetPayload(input, ctx: Context) {
    const { t, user } = ctx;
    const { type, id } = fromGlobalId(input.id);

    if (type !== 'Story') {
      throw new Error(t('The story ID is invalid.'));
    }

    const { data, errors } = validate(input, ctx);
    const story = await db
      .table('stories')
      .where('id', '=', id)
      .first('*');

    if (!story) {
      errors.push({
        key: '',
        message: 'Failed to save the story. Please make sure that it exists.',
      });
    } else if (story.author_id !== user.id) {
      errors.push({ key: '', message: 'You can only edit your own stories.' });
    }

    if (errors.length) {
      throw new ValidationError(errors);
    }

    data.updated_at = db.raw('CURRENT_TIMESTAMP');

    await db
      .table('stories')
      .where('id', '=', id)
      .update(data);
    return ctx.storyById.load(id).then(x => ({ story: x }));
  },
});

export default {
  createStory,
  updateStory,
};
