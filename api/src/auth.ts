/**
 * Authentication middleware.
 *
 * @see https://firebase.google.com/docs/auth/admin/manage-cookies
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import cookie from "cookie";
import firebase from "firebase-admin";
import { RequestHandler, Request, Response } from "express";

import db, { User } from "./db";

async function getUser(req: Request): Promise<User | null> {
  let user = null;

  const auth = firebase.auth();
  const sessionCookie = cookie.parse(req.get("Cookie") || "").session;

  if (sessionCookie) {
    try {
      const fbUser = await auth.verifySessionCookie(sessionCookie);
      user = await db.table("users").where({ id: fbUser.uid }).first();
    } catch (err) {
      console.error(err);
    }
  }

  return user;
}

async function signIn(res: Response, idToken: string): Promise<User | null> {
  const fbUser = await firebase.auth().verifyIdToken(idToken, true);

  if (!fbUser) {
    return null;
  }

  // Allow to sign in only when the provided token is not older than 5 minutes.
  if (new Date().getTime() / 1000 - fbUser.auth_time > 5 * 60) {
    throw new Error("Authentication token has expired.");
  }

  const [user] = await db
    .table("users")
    .where({ id: fbUser.uid })
    .update({ last_login_at: db.fn.now() })
    .returning("*");

  const sessionCookie = await firebase.auth().createSessionCookie(idToken, {
    expiresIn: 1209600000 /* 2 weeks */,
  });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("session", sessionCookie, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 14 /* 2 weeks */,
      secure: process.env.NODE_ENV === "production",
    }),
  );

  return user;
}

function signOut(res: Response): void {
  res.clearCookie("session");
}

export const auth: RequestHandler = async (req, res, next) => {
  try {
    req.user = await getUser(req);
    req.signIn = signIn.bind(undefined, res);
    req.signOut = signOut.bind(undefined, res);

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
