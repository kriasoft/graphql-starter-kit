/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable no-underscore-dangle */

import { Strategy } from 'passport-facebook';
import pool, * as db from '../db';

export default new Strategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: '/login/facebook/return',
  profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  let client;
  let result;
  try {
    client = await pool.connect();
    if (req.user) {
      result = await client.query(
        'SELECT EXISTS(SELECT 1 FROM user_logins WHERE name = $1 AND key = $2)',
        [profile.provider, profile.id]);
      if (result.rows[0].exists) {
        done(new Error('This Facebook account already exists.'));
      } else {
        await db.users.saveLogin(
          client, req.user.id, profile.provider, profile.id, accessToken, refreshToken);
        done(null, await db.users.findById(client, req.user.id));
      }
      done();
    } else {
      result = await db.users.findByLogin(client, profile.provider, profile.id);
      if (result) {
        done(null, result);
      } else {
        result = await client.query(
          'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
          [profile._json.email]);
        if (result.rows[0].exists) {
          done(new Error('A user with this email address already exists.'));
        } else {
          result = await client.query(
            'INSERT INTO users (email) VALUES ($1) RETURNING id, email',
            [profile._json.email]);
          const { id, email } = result.rows[0];
          await db.users.saveLogin(
            client, id, profile.provider, profile.id, accessToken, refreshToken);
          done(null, { id, email });
        }
      }
    }
  } catch (err) {
    done(err);
  } finally {
    if (client) client.release();
  }
});
