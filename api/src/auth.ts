/**
 * Authentication middleware.
 *
 * @see https://firebase.google.com/docs/auth/admin/manage-cookies
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import cookie from "cookie";
import jwt from "jsonwebtoken";
import { RequestHandler, Request, Response } from "express";

import db, { User } from "./db";

const issuer = String(process.env.APP_ORIGIN);
const audience = String(process.env.APP_NAME);
const expiresIn = 60 * 60 * 24 * 14; /* 2 weeks */
const sessionCookieName =
  process.env.NODE_ENV === "production" ? "id" : `id_${process.env.APP_NAME}`;

async function getUser(req: Request): Promise<User | null> {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionCookie = cookies[sessionCookieName];

  if (sessionCookie) {
    try {
      const token = jwt.verify(sessionCookie, String(process.env.JWT_SECRET), {
        issuer,
        audience,
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
    .update({ last_login_at: db.fn.now() })
    .returning("*");

  if (!user) {
    return null;
  }

  const sessionCookie = jwt.sign({}, String(process.env.JWT_SECRET), {
    issuer,
    audience,
    subject: user.id,
    expiresIn,
  });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(sessionCookieName, sessionCookie, {
      httpOnly: true,
      maxAge: expiresIn,
      secure: process.env.NODE_ENV === "production",
    }),
  );

  return user;
}

function signOut(res: Response): void {
  res.clearCookie(sessionCookieName);
}

export const auth: RequestHandler = async (req, res, next) => {
  try {
    req.user = await getUser(req);
    req.signIn = signIn.bind(undefined, res);
    req.signOut = signOut.bind(undefined, res);

    // In some cases it might be useful to useful to ensure
    // that API request fails when user has not been
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
