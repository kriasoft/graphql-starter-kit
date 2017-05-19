/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import Article from '../models/Article';
import User from '../models/User';

/* eslint-disable global-require */

const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
      case 'User':
        return User.findOne({ id });
      case 'Article':
        return Article.findOneById(Number(id));
      default:
        return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return require('./UserType').default;
    }

    if (obj instanceof Article) {
      return require('./ArticleType').default;
    }

    return null;
  },
);

export { nodeInterface, nodeField, nodesField };
