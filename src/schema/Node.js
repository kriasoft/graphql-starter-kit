/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable global-require */

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import { assignType, getType } from '../utils';

const { nodeInterface, nodeField: node, nodesField: nodes } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
      case 'User':
        return context.userById.load(id).then(assignType('User'));
      case 'Email':
        return context.emailById.load(id).then(assignType('Email'));
      case 'Story':
        return context.storyById.load(id).then(assignType('Story'));
      case 'Comment':
        return context.storyById.load(id).then(assignType('Comment'));
      default:
        return null;
    }
  },
  obj => {
    switch (getType(obj)) {
      case 'User':
        return require('./UserType').default;
      case 'Email':
        return require('./EmailType').default;
      case 'Story':
        return require('./StoryType').default;
      case 'Comment':
        return require('./CommentType').default;
      default:
        return null;
    }
  },
);

export { nodeInterface, node, nodes };
