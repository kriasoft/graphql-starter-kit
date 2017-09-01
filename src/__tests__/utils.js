/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env jest */

import { mapTo, mapToMany, mapToValues } from '../utils';

describe('utils', () => {
  test('mapTo()', () => {
    const result = mapTo([1, 2], x => x.id, 'Test')([
      { id: 2, name: 'b' },
      { id: 1, name: 'a' },
    ]);
    expect(result).toMatchSnapshot();
  });

  test('mapToMany()', () => {
    const result = mapToMany([1, 2], x => x.id, 'Test')([
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
