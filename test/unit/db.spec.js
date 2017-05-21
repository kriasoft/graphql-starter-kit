/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import db from '../../src/db';

describe('db', () => {
  it('automatically convert camelCase identifiers to snake_case', () => {
    const { sql: sql1 } = db.table('users')
      .where('first_name', '=', 'Bill')
      .select('user_id as userId')
      .toSQL();
    const { sql: sql2 } = db.table('users')
      .where({ userId: 1 })
      .update({ firstName: 'Bill' })
      .toSQL();
    expect(sql1).to.be.equal('select "user_id" as "userId" from "users" where "first_name" = ?');
    expect(sql2).to.be.equal('update "users" set "first_name" = ? where "user_id" = ?');
  });
});
