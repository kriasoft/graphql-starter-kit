/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable no-param-reassign */

import passport from 'passport';
import validator from 'validator';
import { Router } from 'express';

/**
 * '/about' => `false`
 * 'http://localhost:3000/about' => `true` (but only if this domain name is whitelisted)
 */
function isValidReturnURL(value) {
  return validator.isURL(value, {
    require_protocol: true,
    protocols: ['http', 'https'],
    host_whitelist: process.env.FRONTEND_HOST_WHITELIST ?
      process.env.FRONTEND_HOST_WHITELIST.split(',').map(x => x.trim()) : ['localhost'],
  });
}

/**
 * '/about' => ''
 * 'http://localhost:3000/about' => 'http://localhost:3000'
 */
function getBaseURL(returnURL) {
  if (!returnURL || returnURL[0] === '/') return '';
  const result = returnURL.match(/^https?:\/\/[^\\/]+/i);
  return result ? result[0] : '';
}

const router = new Router();
const loginProviders = [
  {
    provider: 'facebook',
    options: { scope: ['email', 'user_location'] },
  },
  {
    provider: 'google',
    options: { scope: 'profile email' },
  },
  {
    provider: 'twitter',
    options: {},
  },
];

loginProviders.forEach(({ provider, options }) => {
  router.get(`/login/${provider}/return`, (req, res, next) => {
    passport.authenticate(provider, (err, user) => {
      const returnURL = req.session.returnURL || '/';
      const baseURL = getBaseURL(returnURL);
      const { error, info } = req.app.locals;

      if (err) {
        res.redirect(`${baseURL}/login?error=${encodeURIComponent(err.message)}&code=500`);
      } else if (!user) {
        res.redirect(`${baseURL}/login${error ? `?error=${encodeURIComponent(error)}` : ''}`);
      } else {
        req.login(user, (loginErr) => {
          if (loginErr) {
            res.redirect(`${baseURL}/login?error=${encodeURIComponent(loginErr.message)}&code=500`);
          } else if (baseURL) {
            res.redirect(`${returnURL}${returnURL.includes('?') ? '&' : '?'}sessionID=${req.session.id}` +
              `${info ? `&info=${encodeURIComponent(info)}` : ''}`);
          } else {
            req.flash('info', info);
            res.redirect(returnURL);
          }
        });
      }
    })(req, res, next);
  });

  router.get([`/login/${provider}`, `/login/${provider}/*`], (req, res, next) => {
    const returnURL = decodeURIComponent(req.path.substr(`/login/${provider}/`.length));
    req.session.returnURL = isValidReturnURL(returnURL) ? returnURL : `/${returnURL}`;
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    passport.authenticate(provider, options)(req, res, next);
  });
});

router.all(['/logout', '/logout/*'], (req, res) => {
  const returnURL = decodeURIComponent(req.path.substr(8));
  req.logout();

  if (isValidReturnURL(returnURL)) {
    res.redirect(`${getBaseURL(returnURL)}/logout`);
  } else {
    res.redirect('/');
  }
});

export default router;
