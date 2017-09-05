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

/*
 * Helper functions for data loaders (src/Context.js)
 * -------------------------------------------------------------------------- */

// Appends type information to an object, e.g. { id: 1 } => { __type: 'User', id: 1 };
export function assignType(obj: any, type: string) {
  // eslint-disable-next-line no-param-reassign, no-underscore-dangle
  obj.__type = type;
  return obj;
}

export function mapTo(keys, keyFn, type, rows) {
  if (!rows) return mapTo.bind(null, keys, keyFn, type);
  const group = new Map(keys.map(key => [key, null]));
  rows.forEach(row => group.set(keyFn(row), assignType(row, type)));
  return Array.from(group.values());
}

export function mapToMany(keys, keyFn, type, rows) {
  if (!rows) return mapToMany.bind(null, keys, keyFn, type);
  const group = new Map(keys.map(key => [key, []]));
  rows.forEach(row => group.get(keyFn(row)).push(assignType(row, type)));
  return Array.from(group.values());
}

export function mapToValues(keys, keyFn, valueFn, rows) {
  if (!rows) return mapToValues.bind(null, keys, keyFn, valueFn);
  const group = new Map(keys.map(key => [key, null]));
  rows.forEach(row => group.set(keyFn(row), valueFn(row)));
  return Array.from(group.values());
}

/*
 * Hash/verify user passwords using Argon2i algorithm
 * -------------------------------------------------------------------------- */

export function passwordHash(password: string) {
  return new Promise((resolve, reject) => {
    require('bindings')('native').passwordHash(
      password,
      (err, hash) => (err ? reject(err) : resolve(hash)),
    );
  });
}

export function passwordVerify(password: string, hash: string) {
  return new Promise((resolve, reject) => {
    require('bindings')('native').passwordVerify(
      password,
      hash,
      (err, verified) => (err ? reject(err) : resolve(verified)),
    );
  });
}
