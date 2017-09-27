/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env jest */

import fs from 'fs';
import {
  mapTo,
  mapToMany,
  mapToValues,
  passwordHash,
  passwordVerify,
} from '../';

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

  if (fs.existsSync('/.dockerenv')) {
    test('passwordHash()', async () => {
      const hash = await passwordHash('Passw0rd');
      expect(hash).toBeDefined();
      expect(hash).toMatch(/^\$argon2i\$.*/);
    });

    test('passwordVerify()', async () => {
      const hash = '$argon2i$v=19$m=32768,t=4,p=1$/N3vumg47o4EfbdB5FZ5xQ$utzaQCjEKmBTW1g1+50KUOgsRdUmRhNI1TfuxA8X9qU';
      const result1 = await passwordVerify('Passw0rd', hash);
      const result2 = await passwordVerify('wrong-pass', hash);
      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });
  }
});
