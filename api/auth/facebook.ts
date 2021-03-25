/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { IdentityProvider } from "db/types";
import { Router } from "express";
import got from "got";
import { AuthorizationCode } from "simple-oauth2";
import env from "../env";
import connect from "./connect";
import response from "./response";

const router = Router();
const version = "v10.0";
const scope = ["email"];

/**
 * Facebook OAuth 2.0 client.
 *
 * @see https://github.com/lelylan/simple-oauth2
 * @see https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/
 */
const client = new AuthorizationCode({
  client: {
    id: env.FACEBOOK_APP_ID,
    secret: env.FACEBOOK_APP_SECRET,
  },
  auth: {
    tokenHost: "https://graph.facebook.com",
    tokenPath: `/${version}/oauth/access_token`,
    authorizeHost: "https://www.facebook.com",
    authorizePath: `/${version}/dialog/oauth`,
  },
});

router.get("/auth/facebook", function (req, res) {
  const authorizeUrl = client.authorizeURL({
    redirect_uri: env.isProduction
      ? `${env.APP_ORIGIN}/auth/facebook/return`
      : `${req.protocol}://${req.get("host")}/auth/facebook/return`,
    scope,
  });

  res.setHeader("Cache-Control", "no-store");
  res.redirect(authorizeUrl);
});

router.get("/auth/facebook/return", async function (req, res) {
  try {
    res.setHeader("Cache-Control", "no-store");

    const { token } = await client.getToken({
      code: req.query.code as string,
      redirect_uri: env.isProduction
        ? `${env.APP_ORIGIN}/auth/facebook/return`
        : `${req.protocol}://${req.get("host")}/auth/facebook/return`,
      scope,
    });

    // Optionally, secure API calls by adding proof of the app secret.
    // https://developers.facebook.com/docs/reference/api/securing-graph-api/
    // const sha256 = crypto.createHmac("sha256", env.FACEBOOK_APP_SECRET);
    // const appsecret_proof = sha256.update(token.access_token).digest("hex");
    const user = (await got(`https://graph.facebook.com/${version}/me`, {
      method: "GET",
      searchParams: {
        access_token: token.access_token,
        fields: "id,name,first_name,last_name,email,picture",
        // appsecret_proof,
      },
    }).json()) as FacebookUser;

    const data = await connect(req, {
      provider: IdentityProvider.facebook,
      id: user.id,
      email: user.email ?? null,
      email_verified: false,
      name: user.name,
      picture: user.picture.data.url,
      given_name: user.first_name,
      family_name: user.last_name,
      locale: user.locale ?? null,
      access_token: token.access_token,
      refresh_token: token.access_token,
      scopes: scope,
      token_type: token.token_type,
      issued_at: new Date(
        new Date(token.expires_at).getTime() - token.expires_in * 1000,
      ),
      expires_at: new Date(token.expires_at),
    });

    res.send(response({ data }));
  } catch (error) {
    console.error(error);
    res.status(401);
    res.send(response({ error }));
  }
});

type FacebookUser = {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  picture: {
    data: {
      width: number;
      height: number;
      url: string;
      is_silhouette: boolean;
    };
  };
  locale?: string;
};

export default router;
