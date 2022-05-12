/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

// import { memoize } from "lodash";
// import { RequestHandler } from "express";
// import { App, Octokit } from "octokit";
// import { IdentityProvider } from "../core";
// import env from "../env";
// import authorize from "./authorize";

/**
 * Initializes an OAuth 2.0 client for GitHub
 *
 * @see https://github.com/octokit/octokit.js#github-app
 */
// export const getGitHubApp = memoize(function () {
//   return new App({
//     appId: env.GITHUB_APP_ID,
//     privateKey: env.GITHUB_APP_KEY,
//     oauth: {
//       clientId: env.GITHUB_CLIENT_ID,
//       clientSecret: env.GITHUB_CLIENT_SECRET,
//     },
//   });
// });

/**
 * Redirects user to GitHub login page.
 */
// export const redirect: RequestHandler = function (req, res) {
//   const app = getGitHubApp();
//   const authorization = app.oauth.getWebFlowAuthorizationUrl({
//     redirectUrl: req.app.locals.redirect_uri,
//     allowSignup: true,
//   });

//   res.redirect(authorization.url);
// };

/**
 * Obtains authorization tokens and profile information once the user
 * returns from GitHub website.
 */
// export const callback: RequestHandler = async function (req, res, next) {
//   try {
//     const app = getGitHubApp();
//     const { authentication: credentials } = await app.oauth.createToken({
//       code: req.query.code as string,
//       state: req.query.state as string,
//       redirectUrl: req.app.locals.redirect_uri,
//     });

//     // Initialize REST API client
//     const { rest: gh } = (await app.oauth.getUserOctokit(
//       credentials
//     )) as Octokit;

//     // Fetch profile information
//     const { data: profile } = await gh.users.getAuthenticated();
//     const { data: emails } = await gh.users.listEmailsForAuthenticatedUser();
//     const primaryEmail = emails.find((x) => x.primary);

//     // Link OAuth credentials with the user account
//     const user = await authorize(req, {
//       id: String(profile.id),
//       provider: IdentityProvider.GitHub,
//       username: profile.login,
//       email: primaryEmail?.email || profile.email,
//       email_verified: primaryEmail?.verified || false,
//       name: profile.name,
//       profile: profile as Record<string, unknown>,
//       picture: profile.avatar_url,
//       credentials,
//     });

//     res.render("auth-callback", { user, method: "GitHub", layout: false });
//   } catch (err) {
//     next(err);
//   }
// };

export {};
