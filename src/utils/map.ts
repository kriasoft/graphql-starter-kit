/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

type Func<R, K> = (row: R) => K;

export function mapTo<K, R>(keys: ReadonlyArray<K>, keyFn: Func<R, K>) {
  return (rows: Array<R>) => {
    const group = new Map<K, R | null>(keys.map(key => [key, null]));
    rows.forEach(row => group.set(keyFn(row), row));
    return Array.from(group.values());
  };
}

export function mapToMany<K, R>(keys: ReadonlyArray<K>, keyFn: Func<R, K>) {
  return (rows: Array<R>) => {
    const group = new Map<K, R[]>(keys.map(key => [key, []]));
    rows.forEach(row => (group.get(keyFn(row)) || []).push(row));
    return Array.from(group.values());
  };
}

export function mapToValues<K, R, V>(keys: ReadonlyArray<K>, keyFn: Func<R, K>, valueFn: Func<R, V>, defaultValue = null) {
  return (rows: Array<R>) => {
    const group = new Map<K, V | null>(keys.map(key => [key, defaultValue]));
    rows.forEach(row => group.set(keyFn(row), valueFn(row)));
    return Array.from(group.values());
  };
}
