/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import fetch from 'node-fetch';
import redis from '../redis';

let lastFetchTime = 0;
const DATA_URI = 'https://gist.githubusercontent.com/koistya/a32919e847531320675764e7308b796a/raw/articles.json';

// returns [ { id: 1, title: '...', author: '...', url: '...' }, ... ]
async function fetchArticles() {
  lastFetchTime = Date.now();
  const data = await fetch(DATA_URI).then(x => x.json());
  await redis.msetAsync(data.reduce((acc, val, idx) =>
    [...acc, `articles:${data.length - idx}`, JSON.stringify({ id: data.length - idx, ...val })], []));
  return data;
}

class Article {
  id: number;
  title: string;
  author: string;
  url: string;

  constructor(props: any) {
    Object.assign(this, props);
  }

  static async find(): Promise<Article[]> {
    const keys = await redis.keysAsync('articles:*');
    const data = keys.length ?
      (await redis.mgetAsync(keys)).map(x => JSON.parse(x)) :
      (await fetchArticles());

    // Update cache in the background if it's older than 10 minutes
    if (Date.now() - lastFetchTime > 600000) fetchArticles();

    return data.map(x => new Article(x));
  }

  static findOneById(id: number): Promise<Article> {
    return redis.getAsync(`articles:${id}`).then(x => x && new Article(JSON.parse(x)));
  }

  static async findByIds(ids: number[]): Promise<Article[]> {
    if (!lastFetchTime) await fetchArticles();
    return redis.mgetAsync(ids.map(id => `articles:${id}`))
      .then(data => data.map((x, i) => {
        if (!x) throw new Error(`Cannot find an article with ID ${ids[i]}`);
        return new Article(JSON.parse(x));
      }));
  }
}

export default Article;
