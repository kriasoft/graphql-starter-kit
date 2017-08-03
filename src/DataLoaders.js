/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

/*
 * Data loaders to be used with GraphQL resolve() functions. For example:
 *
 *   resolve(post, args, { users }) {
 *     return users.load(post.author_id);
 *   }
 *
 * For more information visit https://github.com/facebook/dataloader
 */

import DataLoader from 'dataloader';

import db from './db';

// Appends type information to an object, e.g. { id: 1 } => { __type: 'User', id: 1 };
function assignType(obj: any, type: string) {
  // eslint-disable-next-line no-param-reassign, no-underscore-dangle
  obj.__type = type;
  return obj;
}

function mapTo(keys, keyFn, type, rows) {
  if (!rows) return mapTo.bind(null, keys, keyFn, type);
  const group = new Map(keys.map(key => [key, null]));
  rows.forEach(row => group.set(keyFn(row), assignType(row, type)));
  return Array.from(group.values());
}

function mapToMany(keys, keyFn, type, rows) {
  if (!rows) return mapToMany.bind(null, keys, keyFn, type);
  const group = new Map(keys.map(key => [key, []]));
  rows.forEach(row => group.get(keyFn(row)).push(assignType(row, type)));
  return Array.from(group.values());
}

function mapToValues(keys, keyFn, valueFn, rows) {
  if (!rows) return mapToValues.bind(null, keys, keyFn, valueFn);
  const group = new Map(keys.map(key => [key, null]));
  rows.forEach(row => group.set(keyFn(row), valueFn(row)));
  return Array.from(group.values());
}

export default {
  create: () => ({
    users: new DataLoader(keys =>
      db
        .table('users')
        .whereIn('id', keys)
        .select()
        .then(mapTo(keys, x => x.id, 'User')),
    ),

    stories: new DataLoader(keys =>
      db
        .table('stories')
        .whereIn('id', keys)
        .select()
        .then(mapTo(keys, x => x.id, 'Story')),
    ),

    storyCommentsCount: new DataLoader(keys =>
      db
        .table('stories')
        .leftJoin('comments', 'stories.id', 'comments.story_id')
        .whereIn('stories.id', keys)
        .groupBy('stories.id')
        .select('stories.id', db.raw('count(comments.story_id)'))
        .then(mapToValues(keys, x => x.id, x => x.count)),
    ),

    storyPointsCount: new DataLoader(keys =>
      db
        .table('stories')
        .leftJoin('story_points', 'stories.id', 'story_points.story_id')
        .whereIn('stories.id', keys)
        .groupBy('stories.id')
        .select('stories.id', db.raw('count(story_points.story_id)'))
        .then(mapToValues(keys, x => x.id, x => x.count)),
    ),

    comments: new DataLoader(keys =>
      db
        .table('comments')
        .whereIn('id', keys)
        .select()
        .then(mapTo(keys, x => x.id, 'Comment')),
    ),

    commentsByStoryId: new DataLoader(keys =>
      db
        .table('comments')
        .whereIn('story_id', keys)
        .select()
        .then(mapToMany(keys, x => x.story_id, 'Comment')),
    ),

    commentsByParentId: new DataLoader(keys =>
      db
        .table('comments')
        .whereIn('parent_id', keys)
        .select()
        .then(mapToMany(keys, x => x.parent_id, 'Comment')),
    ),

    commentPointsCount: new DataLoader(keys =>
      db
        .table('comments')
        .leftJoin('comment_points', 'comments.id', 'comment_points.comment_id')
        .whereIn('comments.id', keys)
        .groupBy('comments.id')
        .select('comments.id', db.raw('count(comment_points.comment_id)'))
        .then(mapToValues(keys, x => x.id, x => x.count)),
    ),
  }),
};
