/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env jest */

import { assignType, getType, mapTo, mapToMany, mapToValues } from '../';

describe('utils', () => {
  test('assignType()', () => {
    const obj = {};
    const result1 = assignType('Test')(obj);
    const result2 = assignType('Test')(null);
    const result3 = assignType('Test')(undefined);
    // eslint-disable-next-line no-underscore-dangle
    expect(obj.__type).toBe('Test');
    expect(result1).toEqual(obj);
    expect(result2).toBeNull();
    expect(result3).toBeUndefined();
  });

  test('getType()', () => {
    const result1 = getType({ __type: 'Test' });
    const result2 = getType({});
    const result3 = getType(undefined);
    expect(result1).toBe('Test');
    expect(result2).toBeUndefined();
    expect(result3).toBeUndefined();
  });

  test('mapTo()', () => {
    const result = mapTo([1, 2], x => x.id)([
      { id: 2, name: 'b' },
      { id: 1, name: 'a' },
    ]);
    expect(result).toMatchSnapshot();
  });

  test('mapToMany()', () => {
    const result = mapToMany([1, 2], x => x.id)([
      { id: 2, name: 'b' },
      { id: 1, name: 'a' },
      { id: 1, name: 'c' },
    ]);
    expect(result).toMatchSnapshot();
  });

  test('mapToValues()', () => {
    const result = mapToValues([1, 2, 3], x => x.id, x => x.name)([
      { id: 2, name: 'b' },
      { id: 1, name: 'a' },
      { id: 3, name: 'c' },
    ]);
    expect(result).toMatchSnapshot();
  });
});
