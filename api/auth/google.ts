/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import { memoize } from "lodash";
import { IdentityProvider } from "../core";
import env from "../env";
import authorize from "./authorize";

/**
 * Initializes an OAuth 2.0 client for Google.
 */
export const getGoogleOAuth2Client = memoize(function () {
  return new OAuth2Client({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  });
});

/**
 * Redirects user to Google login page.
 */
export const redirect: RequestHandler = function (req, res) {
  const oauth = getGoogleOAuth2Client();
  const authorizeUrl = oauth.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
    include_granted_scopes: true,
    redirect_uri: req.app.locals.redirect_uri,
  });

  res.redirect(authorizeUrl);
};

/**
 * Obtains authorization tokens and profile information once the user
 * returns from Facebook website.
 */
export const callback: RequestHandler = async function (req, res, next) {
  try {
    const oauth = getGoogleOAuth2Client();
    const { code } = req.query as { code: string };
    const { redirect_uri } = req.app.locals;
    const { tokens } = await oauth.getToken({ code, redirect_uri });

    // Fetch profile information
    const login = await oauth.verifyIdToken({
      idToken: tokens.id_token as string,
    });

    const userId = login.getUserId();
    const profile = login.getPayload();

    if (!(profile && userId)) {
      throw new Error();
    }

    // Link OAuth credentials with the user account.
    const user = await authorize(req, {
      id: userId,
      provider: IdentityProvider.Google,
      username: undefined,
      email: profile.email,
      email_verified: profile.email_verified,
      name: profile.name,
      profile: profile as unknown as Record<string, unknown>,
      picture: profile.picture,
      credentials: tokens as unknown as Record<string, string>,
    });

    res.render("auth-callback", { user, method: "Google", layout: false });
  } catch (err) {
    next(err);
  }
};
