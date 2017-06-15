/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { me } from './User';
import { node, nodes } from './Node';
import { stories, createStory, updateStory } from './Story';
import { createComment, updateComment } from './Comment';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      me,
      node,
      nodes,
      stories,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createStory,
      updateStory,
      createComment,
      updateComment,
    },
  }),
});
