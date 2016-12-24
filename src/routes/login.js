/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import passport from 'passport';
import { Router } from 'express';

const router = new Router();

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'] }));

router.get('/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

router.get('/google',
  passport.authenticate('google', { scope: 'profile email' }));

router.get('/google/return',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

router.get('/twitter',
  passport.authenticate('twitter'));

router.get('/facebook/return',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

export default router;
