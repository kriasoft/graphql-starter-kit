/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env jest */

import { mapTo } from '../utils';

describe('utils', () => {
  test('mapTo()', () => {
    const result = mapTo([1, 2], x => x.id, 'Test')([
      { id: 2, name: 'b' },
      { id: 1, name: 'a' },
    ]);
    expect(result).toEqual([
      { __type: 'Test', id: 1, name: 'a' },
      { __type: 'Test', id: 2, name: 'b' },
    ]);
  });
});
