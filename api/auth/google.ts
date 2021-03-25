/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { IdentityProvider } from "db/types";
import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import env from "../env";
import connect from "./connect";
import response from "./response";

const router = Router();

/**
 * Google OAuth 2.0 client.
 *
 * @see https://googleapis.dev/nodejs/google-auth-library/latest/
 */
const client = new OAuth2Client({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
});

router.get("/auth/google", function (req, res) {
  const authorizeUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
    include_granted_scopes: true,
    redirect_uri: env.isProduction
      ? `${env.APP_ORIGIN}/auth/google/return`
      : `${req.protocol}://${req.get("host")}/auth/google/return`,
  });

  res.setHeader("Cache-Control", "no-store");
  res.redirect(authorizeUrl);
});

router.get("/auth/google/return", async function (req, res) {
  try {
    const { tokens: credentials } = await client.getToken({
      code: req.query.code as string,
      redirect_uri: env.isProduction
        ? `${env.APP_ORIGIN}/auth/google/return`
        : `${req.protocol}://${req.get("host")}/auth/google/return`,
    });

    const { payload: token } = await client.verifyIdToken({
      idToken: credentials.id_token as string,
    });

    const data = await connect(req, {
      provider: IdentityProvider.google,
      id: token.sub,
      email: token.email,
      email_verified: token.email_verified,
      name: token.name,
      picture: token.picture,
      given_name: token.given_name,
      family_name: token.family_name,
      locale: token.locale as string,
      access_token: credentials.access_token ?? null,
      refresh_token: credentials.refresh_token ?? null,
      scopes: credentials.scope?.split(" ") ?? [],
      token_type: credentials.token_type ?? null,
      issued_at: new Date(token.iat * 1000),
      expires_at: credentials.expiry_date
        ? new Date(credentials.expiry_date)
        : null,
    });

    res.send(response({ data }));
  } catch (error) {
    console.error(error);
    res.status(401);
    res.send(response({ error }));
  }
});

export default router;
