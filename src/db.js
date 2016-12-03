/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import url from 'url';
import Pool from 'pg-pool';
import Promise from 'bluebird';
import { Client } from 'pg';

// Parse database connection string
const { auth, hostname: host, port, pathname } = url.parse(process.env.DATABASE_URL || '');
const [user, password] = auth ? auth.split(':').concat(null) : [null, null];
const database = pathname ? pathname.split('/')[1] : null;

export default new Pool({
  user,
  password,
  host,
  port,
  database,
  Client,
  Promise,
});
