/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env jest */

import Context from '../Context';

describe('Context', () => {
  test('ensureIsAuthenticated()', () => {
    const ctx1 = new Context({ user: null });
    const ctx2 = new Context({ user: {} });
    expect(() => ctx1.ensureIsAuthenticated()).toThrow();
    expect(() => ctx2.ensureIsAuthenticated()).not.toThrow();
  });
});
