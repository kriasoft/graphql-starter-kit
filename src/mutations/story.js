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
import StoryType from '../types/StoryType';
import ValidationError from './ValidationError';

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

function validate(input, { t, user }) {
  const errors = [];
  const data = {};

  if (!user) {
    throw new ValidationError([{ key: '', message: t('Only authenticated users can create stories.') }]);
  }

  if (typeof input.title === 'undefined' || input.title.trim() === '') {
    errors.push({ key: 'title', message: t('The title field cannot be empty.') });
  } else if (!validator.isLength(input.title, { min: 3, max: 80 })) {
    errors.push({ key: 'title', message: t('The title field must be between 3 and 80 characters long.') });
  } else {
    data.title = input.title;
  }

  if (typeof input.url !== 'undefined' && input.url.trim() !== '') {
    if (!validator.isLength(input.url, { max: 200 })) {
      errors.push({ key: 'url', message: t('The URL field cannot be longer than 200 characters long.') });
    } else if (!validator.isURL(input.url)) {
      errors.push({ key: 'url', message: t('The URL is invalid.') });
    } else {
      data.url = input.url;
    }
  }

  if (typeof input.text !== 'undefined' && input.text.trim() !== '') {
    if (!validator.isLength(input.text, { min: 20, max: 2000 })) {
      errors.push({ key: 'text', message: t('The text field must be between 20 and 2000 characters long.') });
    } else {
      data.text = input.text;
    }
  }

  if (data.url && data.text) {
    errors.push({ key: '', message: t('Please fill either the URL or the text field but not both.') });
  } else if (!input.url && !input.text) {
    errors.push({ key: '', message: t('Please fill either the URL or the text field.') });
  }

  data.author_id = user.id;
  return { data, errors };
}

const createStory = mutationWithClientMutationId({
  name: 'CreateStory',
  inputFields,
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { stories } = context;
    const { data, errors } = validate(input, context);

    if (errors.length) {
      throw new ValidationError(errors);
    }

    const rows = await db.table('stories').insert(data).returning('id');
    return stories.load(rows[0]).then(story => ({ story }));
  },
});

const updateStory = mutationWithClientMutationId({
  name: 'UpdateStory',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    ...inputFields,
  },
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { t, user, stories } = context;
    const { type, id } = fromGlobalId(input.id);

    if (type !== 'Story') {
      throw new Error(t('The story ID is invalid.'));
    }

    const { data, errors } = validate(input, context);
    const story = await db.table('stories').where('id', '=', id).first('*');

    if (!story) {
      errors.push({ key: '', message: 'Failed to save the story. Please make sure that it exists.' });
    } else if (story.author_id !== user.id) {
      errors.push({ key: '', message: 'You can only edit your own stories.' });
    }

    if (errors.length) {
      throw new ValidationError(errors);
    }

    data.updated_at = db.raw('CURRENT_TIMESTAMP');

    await db.table('stories').where('id', '=', id).update(data);
    await stories.clear(id);
    return stories.load(id).then(x => ({ story: x }));
  },
});

export default {
  createStory,
  updateStory,
};
