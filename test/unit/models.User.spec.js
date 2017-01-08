/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import User from '../../src/models/User';

describe('models/User', () => {
  it('.create()', async () => {
    const email = `__test__${Date.now()}__@example.com`;
    const user = await User.create({ email });
    expect(user).to.be.ok;
    expect(user.id).to.be.ok;
    expect(user.email).to.be.equal(email);
    const existsTrue = await User.any({ email });
    const existsFalse = await User.any({ email: `${Date.now()}@example.com` });
    expect(existsTrue).to.be.true;
    expect(existsFalse).to.be.false;
  });
});
