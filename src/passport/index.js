/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import passport from 'passport';
import FacebookStrategy from './FacebookStrategy';
import GoogleStrategy from './GoogleStrategy';
import TwitterStrategy from './TwitterStrategy';
import db from '../db';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.users.findById(id).then(user => done(null, user), done);
});

passport.use(FacebookStrategy);
passport.use(GoogleStrategy);
passport.use(TwitterStrategy);

export default passport;
