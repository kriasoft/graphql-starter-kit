/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable no-param-reassign, no-underscore-dangle */

import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';

import db from './db';

passport.serializeUser((user, done) => {
  done(null, { id: user.id, email: user.email });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Creates or updates the external login credentials
// and returns the currently authenticated user.
async function createLogin(req, provider, profile, tokens) {
  if (typeof profile.email === 'undefined' || !profile.email) throw new Error('profile.email is missing.');
  if (typeof profile.email_verified !== 'boolean') throw new Error('profile.email_verified is missing.');

  let user;

  if (req.user) {
    user = await db.table('users').where({ id: req.user.id }).first();
  }

  if (!user) {
    user = await db.table('logins')
      .innerJoin('users', 'users.id', 'logins.user_id')
      .where({ 'logins.provider': provider, 'logins.id': profile.id })
      .first('users.*');
    if (!user && profile.email_verified) {
      user = await db.table('users')
        .where({ email: profile.email, email_verified: true })
        .first();
    }
  }

  if (!user) {
    user = (await db.table('users')
      .insert({
        email: profile.email,
        email_verified: profile.email_verified,
        display_name: profile.display_name,
      })
      .returning('*'))[0];
  }

  const loginKeys = { user_id: user.id, provider, id: profile.id };
  const login = await db.table('logins').where(loginKeys).first();

  if (login) {
    await db.table('logins').where(loginKeys).update({
      tokens: JSON.stringify(tokens),
      profile: JSON.stringify(profile._json),
      username: profile.username,
      updated_at: db.raw('CURRENT_TIMESTAMP'),
    });
  } else {
    await db.table('logins').insert({
      ...loginKeys,
      username: profile.username,
      tokens: JSON.stringify(tokens),
      profile: JSON.stringify(profile._json),
    });
  }

  return user;
}

// https://github.com/jaredhanson/passport-google-oauth2
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/login/google/return',
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    profile.email = profile._json.email;
    profile.email_verified = true;
    const user = await createLogin(req, 'google', profile, { accessToken, refreshToken });
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// https://github.com/jaredhanson/passport-facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
  callbackURL: '/login/facebook/return',
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    profile.email = profile.emails[0].value;
    profile.email_verified = true;
    profile.display_name = `${profile._json.first_name} ${profile._json.last_name}`;
    const user = await createLogin(req, 'facebook', profile, { accessToken, refreshToken });
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// https://github.com/jaredhanson/passport-twitter
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: '/login/twitter/return',
  passReqToCallback: true,
}, async (req, token, tokenSecret, profile, done) => {
  try {
    profile.email = profile._json.email || `${profile.username}@twitter.com`;
    profile.email_verified = !!profile._json.email;
    const user = await createLogin(req, 'twitter', profile, { token, tokenSecret });
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

export default passport;
