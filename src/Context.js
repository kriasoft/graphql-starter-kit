/**
 * Copyright © 2016-present Kriasoft.
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
import { UnauthorizedError } from './errors';

class Context {
  request: Request;
  user: any;
  t: Translator;

  constructor(request: Request) {
    this.request = request;
    this.t = request.t;
  }

  get user(): any {
    return this.request.user;
  }

  /*
   * Data loaders to be used with GraphQL resolve() functions. For example:
   *
   *   resolve(post: any, args: any, { userById }: Context) {
   *     return userById.load(post.author_id);
   *   }
   *
   * For more information visit https://github.com/facebook/dataloader
   */

  userById = new DataLoader(keys =>
    db
      .table('users')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  emailById = new DataLoader(keys =>
    db
      .table('emails')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  emailsByUserId = new DataLoader(keys =>
    db
      .table('emails')
      .whereIn('user_id', keys)
      .select()
      .then(mapToMany(keys, x => x.user_id)),
  );

  storyById = new DataLoader(keys =>
    db
      .table('stories')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
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
      .then(mapTo(keys, x => x.id)),
  );

  commentsByStoryId = new DataLoader(keys =>
    db
      .table('comments')
      .whereIn('story_id', keys)
      .select()
      .then(mapToMany(keys, x => x.story_id)),
  );

  commentsByParentId = new DataLoader(keys =>
    db
      .table('comments')
      .whereIn('parent_id', keys)
      .select()
      .then(mapToMany(keys, x => x.parent_id)),
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

  /*
   * Authenticatinon and permissions.
   */

  ensureIsAuthenticated() {
    if (!this.user) throw new UnauthorizedError();
  }
}

export default Context;
