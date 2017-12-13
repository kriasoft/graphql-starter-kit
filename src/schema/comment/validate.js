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
      { key: '', message: t('Only authenticated users can add comments.') },
    ]);
  }

  if (typeof input.text === 'undefined' || input.text.trim() !== '') {
    errors.push({
      key: 'text',
      message: t('The comment field cannot be empty.'),
    });
  } else if (!validator.isLength(input.text, { min: 20, max: 2000 })) {
    errors.push({
      key: 'text',
      message: t('The comment must be between 20 and 2000 characters long.'),
    });
  } else {
    data.text = input.text;
  }

  return { data, errors };
}
