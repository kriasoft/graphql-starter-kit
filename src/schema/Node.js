/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable global-require, no-underscore-dangle */

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

const { nodeInterface, nodeField: node, nodesField: nodes } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'User') return context.userById.load(id);
    if (type === 'Email') return context.emailById.load(id);
    if (type === 'Story') return context.storyById.load(id);
    if (type === 'Comment') return context.commentById.load(id);

    return null;
  },
  obj => {
    if (obj.__type === 'User') return require('./UserType').default;
    if (obj.__type === 'Email') return require('./EmailType').default;
    if (obj.__type === 'Story') return require('./StoryType').default;
    if (obj.__type === 'Comment') return require('./CommentType').default;

    return null;
  },
);

export { nodeInterface, node, nodes };
