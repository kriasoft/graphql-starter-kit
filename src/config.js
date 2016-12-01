/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

//
// Node.js server settings
// -----------------------------------------------------------------------------
const port = process.env.PORT || 5000;
const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
const message = `The GraphQL server is running at http://${host}/`;

//
// Database settings
// -----------------------------------------------------------------------------
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/graphql';

//
// Authentication
// -----------------------------------------------------------------------------
const jwtSecret = process.env.JWT_SECRET || 'GraphQL Starter Kit';

module.exports = {
  port,
  host,
  message,
  databaseUrl,
  jwtSecret,
};
