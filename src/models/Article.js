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
import fetch from 'node-fetch';
import redis from '../redis';

const DATA_URI = 'https://gist.githubusercontent.com/koistya/a32919e847531320675764e7308b796a/raw/articles.json';

let loader;
let lastFetchTime = 0;

// returns [ { id: 1, title: '...', author: '...', url: '...' }, ... ]
async function fetchArticles() {
  const data = await fetch(DATA_URI).then(x => x.json());
  await redis.msetAsync(data.reduce((acc, val, idx) =>
    [...acc, `articles:${data.length - idx}`, JSON.stringify(val)], []));
  return data.map((x, i) => ({ id: data.length - i, ...x }));
}

class Article {
  id: number;
  title: string;
  author: string;
  url: string;

  static async find() {
    const keys = await redis.keysAsync('articles:*');
    const data = keys.length ?
      (await redis.mgetAsync(keys)).map((x, i) => ({ id: keys[i], ...JSON.parse(x) })) :
      (await fetchArticles());

    // Update cache in the background
    if (Date.now() - lastFetchTime > 600000 /* 10 min */) {
      lastFetchTime = Date.now();
      fetchArticles();
    }

    return data.map(x => Object.assign(new Article(), x));
  }

  static load(keys) {
    return loader.load(keys);
  }
}

loader = new DataLoader(keys => Promise.resolve()
    .then(() => lastFetchTime ? null : fetchArticles()) // eslint-disable-line no-confusing-arrow
    .then(() => redis.mgetAsync(keys.map(x => `articles:${x}`)))
    .then(data => data.map((x, i) => {
      if (x) return Object.assign(new Article(), x, { id: keys[i] });
      throw new Error(`Cannot find an article with ID ${keys[i]}`);
    })));

export default Article;
