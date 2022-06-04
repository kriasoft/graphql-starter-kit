/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { RequestHandler } from "express";
import got from "got";
import { memoize } from "lodash";
import { AuthorizationCode } from "simple-oauth2";
import { IdentityProvider } from "../core";
import env from "../env";
import authorize from "./authorize";
import { createState, verifyState } from "./state";

const scope = ["email"];
const version = "v12.0";

/**
 * Initializes an OAuth 2.0 client for Facebook.
 *
 * @see https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
 */
export const getFacebookOAuth2Client = memoize(function () {
  return new AuthorizationCode({
    client: { id: env.FACEBOOK_APP_ID, secret: env.FACEBOOK_APP_SECRET },
    auth: {
      tokenHost: "https://graph.facebook.com",
      tokenPath: `/${version}/oauth/access_token`,
      authorizeHost: "https://www.facebook.com",
      authorizePath: `/${version}/dialog/oauth`,
    },
  });
});

/**
 * Redirects user to Facebook login page.
 */
export const redirect: RequestHandler = async function (req, res) {
  const { redirect_uri } = req.app.locals;
  const oauth = getFacebookOAuth2Client();
  const state = await createState({});
  const authorizeUrl = oauth.authorizeURL({ redirect_uri, scope, state });
  res.redirect(authorizeUrl);
};

/**
 * Obtains authorization tokens and profile information once the user
 * returns from Facebook website.
 */
export const callback: RequestHandler = async function (req, res, next) {
  try {
    await verifyState(req.query.state as string);
    const oauth = getFacebookOAuth2Client();
    const { code } = req.query as { code: string };
    const { redirect_uri } = req.app.locals;
    const { token } = await oauth.getToken({ code, redirect_uri, scope });

    // Fetch profile information
    // https://developers.facebook.com/docs/graph-api/reference/user
    const { access_token } = token;
    const profile = await got
      .get({
        url: `https://graph.facebook.com/${version}/me`,
        searchParams: { access_token, fields: "id,name,email,picture" },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .json<{ id: string; name: string; email?: string; picture?: any }>();

    // Link OAuth credentials with the user account.
    const user = await authorize(req, {
      provider: IdentityProvider.Facebook,
      id: profile.id,
      name: profile.name,
      email: profile.email,
      email_verified: profile.email ? true : false,
      picture: profile.picture?.data,
      profile,
      credentials: token,
    });

    res.render("auth-callback", { user, method: "Facebook", layout: false });
  } catch (err) {
    next(err);
  }
};
