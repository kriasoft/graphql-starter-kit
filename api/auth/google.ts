/**
 * OAuth authentication middleware for Google.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { IdentityProvider } from "db/types";

import env from "../env";
import connect from "./connect";
import response from "./response";

const client = new OAuth2Client({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${env.APP_ORIGIN}/auth/google/return`,
});

export function auth(req: Request, res: Response): void {
  const authorizeUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
    include_granted_scopes: true,
    redirect_uri: env.isProduction
      ? undefined
      : `${req.protocol}://${req.get("host")}${req.path}/return`, // TEMP
  });

  res.redirect(authorizeUrl);
}

export async function callback(req: Request, res: Response): Promise<void> {
  try {
    const { tokens: credentials } = await client.getToken({
      code: req.query.code as string,
      redirect_uri: env.isProduction
        ? undefined
        : `${req.protocol}://${req.get("host")}${req.path}`, // TEMP
    });

    const { payload: token } = await client.verifyIdToken({
      idToken: credentials.id_token as string,
    });

    const user = await connect(req, {
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

    res.send(response({ user }));
  } catch (error) {
    console.error(error);
    res.status(401);
    res.send(response({ error }));
  }
}
