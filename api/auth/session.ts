/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import cookie from "cookie";
import { Request, RequestHandler, Response } from "express";
import { Unauthorized } from "http-errors";
import {
  createIdToken,
  db,
  decodeIdToken,
  IdentityProvider,
  log,
  User,
  verifyIdToken,
} from "../core";
import env from "../env";
import { getGoogleOAuth2Client } from "./google";

// The name of the session (ID) cookie.
const cookieName = env.isProduction
  ? "id"
  : `id_${env.APP_NAME?.replace(/\W/g, "")}`;

async function getUser(req: Request): Promise<User | null> {
  const cookies = cookie.parse(req.headers.cookie || "");
  const idToken =
    req.headers.authorization?.startsWith("Bearer ") ||
    req.headers.authorization?.startsWith("bearer ")
      ? req.headers.authorization.substring(7)
      : cookies[cookieName];

  if (idToken) {
    try {
      let token = decodeIdToken(idToken);

      // If the token was issued by Google, verify it using
      // Google's OAuth 2.0 client ID
      if (token?.iss === "https://accounts.google.com") {
        const oauth = getGoogleOAuth2Client();
        const login = await oauth.verifyIdToken({ idToken }).catch((err) => {
          throw new Unauthorized(err.message);
        });
        const userId = login.getUserId();
        if (!userId) return null;

        const user = await db
          .table("identity")
          .leftJoin("user", "user.id", "identity.user_id")
          .where("identity.provider", "=", IdentityProvider.Google)
          .andWhere("identity.id", "=", userId)
          .first("user.*");

        if (!user) {
          throw new Unauthorized(
            `Not a registered user (Google User ID: ${userId}).`,
          );
        }

        return user;
      }

      token = token && (await verifyIdToken(idToken));
      if (!token) return null;
      const user = await db.table("user").where({ id: token.sub }).first();
      return user ?? null;
    } catch (err) {
      if (err instanceof Unauthorized) {
        throw err;
      } else {
        log(req, "WARNING", err as Error);
        return null;
      }
    }
  }

  return null;
}

async function signIn(
  req: Request,
  res: Response,
  user: User | null | undefined,
): Promise<User | null> {
  if (!user) {
    return null;
  }

  [user] = await db
    .table<User>("user")
    .where({ id: user.id })
    .update({ last_login: db.fn.now() })
    .returning("*");

  if (!user) {
    req.user = null;
    return null;
  }

  const idToken = await createIdToken(user);

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(cookieName, idToken, {
      httpOnly: true,
      maxAge: env.SESSION_EXPIRES,
      secure: env.isProduction,
      path: "/",
    }),
  );

  return (req.user = user);
}

function signOut(req: Request, res: Response): void {
  req.user = null;
  res.clearCookie(cookieName);
}

const session: RequestHandler = async function session(req, res, next) {
  try {
    req.user = await getUser(req);
    req.signIn = signIn.bind(undefined, req, res);
    req.signOut = signOut.bind(undefined, req, res);

    // In some cases it might be useful to ensure that the API
    // request fails when the user was not authenticated.
    if (req.query.authorize !== undefined && !req.user) {
      res.status(401);
      res.end();
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

export default session;
