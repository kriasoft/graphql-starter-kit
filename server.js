/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const expressGraphQL = require('express-graphql');
const PrettyError = require('pretty-error');
const schema = require('./schema');
const config = require('./config');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressJwt({
  secret: config.auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));

app.use(expressGraphQL(req => ({
  schema,
  context: {
    user: req.user,
  },
  graphiql: true,
  pretty: process.env.NODE_ENV !== 'production',
})));

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  console.error(pe.render(err)); // eslint-disable-line no-console
  next(err);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`The GraphQL server is running at http://localhost:${port}/`);
});

module.exports = app;
