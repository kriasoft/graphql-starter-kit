/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import UserType from './UserType';
import type Context from '../../Context';

const me = {
  type: UserType,
  resolve(root: any, args: any, ctx: Context) {
    return ctx.user && ctx.userById.load(ctx.user.id);
  },
};

export default {
  me,
};
