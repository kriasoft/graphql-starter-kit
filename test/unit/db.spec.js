/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import db from '../../src/db';

describe('db', () => {
  it('.connect()', async () => {
    const client = await db.connect();
    try {
      const result = await client.query('SELECT NOW()');
      expect(client).to.be.ok;
      expect(result).to.be.ok;
      expect(result.rows.length).to.be.equal(1);
      expect(result.rows[0][result.fields[0].name]).to.be.ok;
    } finally {
      client.release();
    }
  });
});
