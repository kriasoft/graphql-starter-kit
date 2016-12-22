/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { Strategy } from 'passport-twitter';
import db from '../db';

export default new Strategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: '/login/twitter/return',
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const accessTokenClaim = `urn:${profile.provider}:access_token`;
    const refreshTokenClaim = `urn:${profile.provider}:refresh_token`;

    if (req.user) {
      if (await db.userLogins.any(profile.provider, profile.id)) {
        const err = new Error('There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.');
        req.flash('errors', { msg: err.message });
        done(err);
      } else {
        await db.userLogins.create(req.user.id, profile.provider, profile.id);
        await db.userClaims.createOrUpdate(req.user.id, accessTokenClaim, accessToken);
        await db.userClaims.createOrUpdate(req.user.id, refreshTokenClaim, refreshToken);
        req.flash('info', { msg: 'Twitter account has been linked.' });
        done(null, await db.users.findById(req.user.id));
      }
    } else {
      let user = await db.users.findByLogin(profile.provider, profile.id);
      if (user) {
        done(null, user);
      } else {
        user = await db.users.create(`${profile.username}@twitter.com`);
        await db.userLogins.create(user.id, profile.provider, profile.id);
        await db.userClaims.createOrUpdate(user.id, accessTokenClaim, accessToken);
        await db.userClaims.createOrUpdate(user.id, refreshTokenClaim, refreshToken);
        done(null, user);
      }
    }
  } catch (err) {
    done(err);
  }
});
