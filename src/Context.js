/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import DataLoader from 'dataloader';
import type { request as Request } from 'express';
import type { t as Translator } from 'i18next';

import db from './db';
import { mapTo, mapToMany, mapToValues } from './utils';

class Context {
  request: Request;
  user: any;
  t: Translator;

  constructor(request: Request) {
    this.request = request;
    this.user = request.user;
    this.t = request.t;
  }

  /*
   * Data loaders to be used with GraphQL resolve() functions. For example:
   *
   *   resolve(post, args, { users }) {
   *     return users.load(post.author_id);
   *   }
   *
   * For more information visit https://github.com/facebook/dataloader
   */

  userById = new DataLoader(keys =>
    db
      .table('users')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id, 'User')),
  );

  storyById = new DataLoader(keys =>
    db
      .table('stories')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id, 'Story')),
  );

  storyCommentsCount = new DataLoader(keys =>
    db
      .table('stories')
      .leftJoin('comments', 'stories.id', 'comments.story_id')
      .whereIn('stories.id', keys)
      .groupBy('stories.id')
      .select('stories.id', db.raw('count(comments.story_id)'))
      .then(mapToValues(keys, x => x.id, x => x.count)),
  );

  storyPointsCount = new DataLoader(keys =>
    db
      .table('stories')
      .leftJoin('story_points', 'stories.id', 'story_points.story_id')
      .whereIn('stories.id', keys)
      .groupBy('stories.id')
      .select('stories.id', db.raw('count(story_points.story_id)'))
      .then(mapToValues(keys, x => x.id, x => x.count)),
  );

  commentById = new DataLoader(keys =>
    db
      .table('comments')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id, 'Comment')),
  );

  commentsByStoryId = new DataLoader(keys =>
    db
      .table('comments')
      .whereIn('story_id', keys)
      .select()
      .then(mapToMany(keys, x => x.story_id, 'Comment')),
  );

  commentsByParentId = new DataLoader(keys =>
    db
      .table('comments')
      .whereIn('parent_id', keys)
      .select()
      .then(mapToMany(keys, x => x.parent_id, 'Comment')),
  );

  commentPointsCount = new DataLoader(keys =>
    db
      .table('comments')
      .leftJoin('comment_points', 'comments.id', 'comment_points.comment_id')
      .whereIn('comments.id', keys)
      .groupBy('comments.id')
      .select('comments.id', db.raw('count(comment_points.comment_id)'))
      .then(mapToValues(keys, x => x.id, x => x.count)),
  );
}

export default Context;
