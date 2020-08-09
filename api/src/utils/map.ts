/**
 * Helper functions that order data records so that they
 * match the provided keys array.
 *
 * @see https://github.com/graphql/dataloader
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

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
