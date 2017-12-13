/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import validator from 'validator';

import { ValidationError } from '../../errors';
import type Context from '../../Context';
import type { ValidationOutput } from '../../types';

export default function validate(input: any, ctx: Context): ValidationOutput {
  const errors = [];
  const data = {};
  const { t, user } = ctx;

  if (!user) {
    throw new ValidationError([
      { key: '', message: t('Only authenticated users can create stories.') },
    ]);
  }

  if (typeof input.title === 'undefined' || input.title.trim() === '') {
    errors.push({
      key: 'title',
      message: t('The title field cannot be empty.'),
    });
  } else if (!validator.isLength(input.title, { min: 3, max: 80 })) {
    errors.push({
      key: 'title',
      message: t('The title field must be between 3 and 80 characters long.'),
    });
  } else {
    data.title = input.title;
  }

  if (typeof input.url !== 'undefined' && input.url.trim() !== '') {
    if (!validator.isLength(input.url, { max: 200 })) {
      errors.push({
        key: 'url',
        message: t('The URL field cannot be longer than 200 characters long.'),
      });
    } else if (!validator.isURL(input.url)) {
      errors.push({ key: 'url', message: t('The URL is invalid.') });
    } else {
      data.url = input.url;
    }
  }

  if (typeof input.text !== 'undefined' && input.text.trim() !== '') {
    if (!validator.isLength(input.text, { min: 20, max: 2000 })) {
      errors.push({
        key: 'text',
        message: t(
          'The text field must be between 20 and 2000 characters long.',
        ),
      });
    } else {
      data.text = input.text;
    }
  }

  if (data.url && data.text) {
    errors.push({
      key: '',
      message: t('Please fill either the URL or the text field but not both.'),
    });
  } else if (!input.url && !input.text) {
    errors.push({
      key: '',
      message: t('Please fill either the URL or the text field.'),
    });
  }

  data.author_id = user.id;
  return { data, errors };
}
