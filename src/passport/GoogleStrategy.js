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
        done(new Error('This Facebook account already exists.'));
      } else {
        await db.userLogins.create(req.user.id, profile.provider, profile.id);
        await db.userClaims.createOrUpdate(req.user.id, accessTokenClaim, accessToken);
        await db.userClaims.createOrUpdate(req.user.id, refreshTokenClaim, refreshToken);
        done(null, await db.users.findById(req.user.id));
      }
    } else {
      let user = await db.users.findByLogin(profile.provider, profile.id);
      if (user) {
        done(null, user);
      } else {
        user = await db.users.any(profile.emails[0].value);
        if (user) {
          done(new Error('A user with this email address already exists.'));
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
