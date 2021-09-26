/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

// These helper functions are intended to be used in data loaders for mapping
// entity keys to entity values (db records). See `../context.ts`.
// https://github.com/graphql/dataloader

export function mapTo<R, K>(
  records: ReadonlyArray<R>,
  keys: ReadonlyArray<K>,
  keyFn: (record: R) => K,
): Array<R | null> {
  const map = new Map(records.map((x) => [keyFn(x), x]));
  return keys.map((key) => map.get(key) || null);
}

export function mapToMany<R, K>(
  records: ReadonlyArray<R>,
  keys: ReadonlyArray<K>,
  keyFn: (record: R) => K,
): Array<R[]> {
  const group = new Map<K, R[]>(keys.map((key) => [key, []]));
  records.forEach((record) => (group.get(keyFn(record)) || []).push(record));
  return Array.from(group.values());
}

export function mapToValues<R, K, V>(
  records: ReadonlyArray<R>,
  keys: ReadonlyArray<K>,
  keyFn: (record: R) => K,
  valueFn: (record?: R) => V,
): Array<V> {
  const map = new Map(records.map((x) => [keyFn(x), x]));
  return keys.map((key) => valueFn(map.get(key)));
}

export function mapToManyValues<R, K, V>(
  records: ReadonlyArray<R>,
  keys: ReadonlyArray<K>,
  keyFn: (record: R) => K,
  valueFn: (record?: R) => V,
): Array<V[]> {
  const group = new Map<K, V[]>(keys.map((key) => [key, []]));
  records.forEach((record) =>
    (group.get(keyFn(record)) || []).push(valueFn(record)),
  );
  return Array.from(group.values());
}
