/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLObjectType } from 'graphql';
import User from './User';

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    me: {
      type: User,
      resolve(root, args, { user }) {
        return user;
      },
    },
  },
});
