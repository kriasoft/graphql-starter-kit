/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

module.exports = {
  //
  // Authentication
  // ---------------------------------------------------------------------------
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || 'GraphQL Starter Kit',
    },
  },
};
