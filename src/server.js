/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import app from './app';
import config from './config';

const server = app.listen(config.port, () => {
  process.stdout.write(config.message);
});

export default server;
