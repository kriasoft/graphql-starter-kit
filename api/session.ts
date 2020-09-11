/**
 * JWT-based session middleware.
 *
 * @see https://firebase.google.com/docs/auth/admin/manage-cookies
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import cookie from "cookie";
import jwt from "jsonwebtoken";
import { RequestHandler, Request, Response } from "express";
import type { User } from "db";

import db from "./db";
import env from "./env";

async function getUser(req: Request): Promise<User | null> {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionCookie = cookies[env.JWT_COOKIE];

  if (sessionCookie) {
    try {
      const token = jwt.verify(sessionCookie, env.JWT_SECRET, {
        issuer: env.APP_ORIGIN,
        audience: env.APP_NAME,
      }) as { sub: string };
      const user = await db.table("users").where({ id: token.sub }).first();
      return user || null;
    } catch (err) {
      console.error(err);
    }
  }

  return null;
}

async function signIn(
  res: Response,
  user: User | null | undefined,
): Promise<User | null> {
  if (!user) {
    return null;
  }

  [user] = await db
    .table<User>("users")
    .where({ id: user.id })
    .update({ last_login: db.fn.now() })
    .returning("*");

  if (!user) {
    return null;
  }

  const sessionCookie = jwt.sign({}, env.JWT_SECRET, {
    issuer: env.APP_ORIGIN,
    audience: env.APP_NAME,
    subject: user.id,
    expiresIn: env.JWT_EXPIRES,
  });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(env.JWT_COOKIE, sessionCookie, {
      httpOnly: true,
      maxAge: env.JWT_EXPIRES,
      secure: env.isProduction,
      path: "/",
    }),
  );

  return user;
}

function signOut(res: Response): void {
  res.clearCookie(env.JWT_COOKIE);
}

export const session: RequestHandler = async function session(req, res, next) {
  try {
    req.user = await getUser(req);
    req.signIn = signIn.bind(undefined, res);
    req.signOut = signOut.bind(undefined, res);

    // In some cases it might be useful to ensure that the API
    // request fails when the user was not authenticated.
    if (req.query.authorize !== undefined && !req.user) {
      res.status(401);
      res.end();
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    next();
  }
};
