/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import cookie from "cookie";
import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../db";
import db from "../db";
import env from "../env";

// The name of the session (ID) cookie.
const cookieName = env.isProduction
  ? "id"
  : `id_${env.APP_NAME?.replace(/^W/g, "")}`;

async function getUser(req: Request): Promise<User | null> {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionCookie = cookies[cookieName];

  if (sessionCookie) {
    try {
      const token = jwt.verify(sessionCookie, env.JWT_SECRET, {
        issuer: env.APP_ORIGIN,
        audience: env.APP_NAME,
      }) as { sub: string };
      const user = await db.table("user").where({ id: token.sub }).first();
      return user || null;
    } catch (err) {
      console.error(err);
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

  const sessionCookie = jwt.sign({}, env.JWT_SECRET, {
    issuer: env.APP_ORIGIN,
    audience: env.APP_NAME,
    subject: String(user.id),
    expiresIn: env.JWT_EXPIRES,
  });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(cookieName, sessionCookie, {
      httpOnly: true,
      maxAge: env.JWT_EXPIRES,
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
    console.error(err);
    next();
  }
};

export default session;
