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
 * Helper functions for data loaders (src/Context.js)
 * -------------------------------------------------------------------------- */

export function assignType(type: string) {
  return (obj: any) => {
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    if (obj) obj.__type = type;
    return obj;
  };
}

export function getType(obj: any) {
  // eslint-disable-next-line no-underscore-dangle
  return obj ? obj.__type : undefined;
}

export function mapTo(
  keys: Array<string | number>,
  keyFn: any => string | number,
) {
  return (rows: Array<any>) => {
    const group = new Map(keys.map(key => [key, null]));
    rows.forEach(row => group.set(keyFn(row), row));
    return Array.from(group.values());
  };
}

export function mapToMany(
  keys: Array<string | number>,
  keyFn: any => string | number,
) {
  return (rows: Array<any>) => {
    const group = new Map(keys.map(key => [key, []]));
    rows.forEach(row => group.get(keyFn(row)).push(row));
    return Array.from(group.values());
  };
}

export function mapToValues(
  keys: Array<string | number>,
  keyFn: any => string | number,
  valueFn: any => any,
) {
  return (rows: Array<any>) => {
    const group = new Map(keys.map(key => [key, null]));
    rows.forEach(row => group.set(keyFn(row), valueFn(row)));
    return Array.from(group.values());
  };
}

/*
 * Hash/verify user passwords using Argon2i algorithm
 * -------------------------------------------------------------------------- */

export function passwordHash(password: string) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line global-require
    require('bindings')('native').passwordHash(
      password,
      (err, hash) => (err ? reject(err) : resolve(hash)),
    );
  });
}

export function passwordVerify(password: string, hash: string) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line global-require
    require('bindings')('native').passwordVerify(
      password,
      hash,
      (err, verified) => (err ? reject(err) : resolve(verified)),
    );
  });
}
