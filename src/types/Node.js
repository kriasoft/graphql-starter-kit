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
import ArticleType from '../types/ArticleType';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'Article') {
      return Article.load(id);
    }

    return null;
  },
  (obj) => {
    if (obj instanceof Article) {
      return ArticleType;
    }

    return null;
  },
);

export default {
  interface: nodeInterface,
  field: nodeField,
};
