/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { OAuth2Strategy } from 'passport-google-oauth';
import db from '../db';

export default new OAuth2Strategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/login/google/return',
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const accessTokenClaim = `urn:${profile.provider}:access_token`;
    const refreshTokenClaim = `urn:${profile.provider}:refresh_token`;

    if (req.user) {
      if (await db.userLogins.any(profile.provider, profile.id)) {
        const err = new Error('There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.');
        req.flash('errors', { msg: err.message });
        done(err);
      } else {
        await db.userLogins.create(req.user.id, profile.provider, profile.id);
        await db.userClaims.createOrUpdate(req.user.id, accessTokenClaim, accessToken);
        await db.userClaims.createOrUpdate(req.user.id, refreshTokenClaim, refreshToken);
        req.flash('info', { msg: 'Google account has been linked.' });
        done(null, await db.users.findById(req.user.id));
      }
    } else {
      let user = await db.users.findByLogin(profile.provider, profile.id);
      if (user) {
        done(null, user);
      } else {
        user = await db.users.any(profile.emails[0].value);
        if (user) {
          const err = new Error('There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.');
          req.flash('errors', { msg: err.message });
          done(err);
        } else {
          user = await db.users.create(profile.emails[0].value);
          await db.userLogins.create(user.id, profile.provider, profile.id);
          await db.userClaims.createOrUpdate(user.id, accessTokenClaim, accessToken);
          await db.userClaims.createOrUpdate(user.id, refreshTokenClaim, refreshToken);
          done(null, user);
        }
      }
    }
  } catch (err) {
    done(err);
  }
});
