/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import dotenv from 'dotenv';
import app from './app';

dotenv.config({ silent: true });

const server = app.listen(process.env.PORT, () => {
  process.stdout.write(`Node.js app is listening on http://localhost:${String(process.env.PORT)}/\n`);
});

export default server;
