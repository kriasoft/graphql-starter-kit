/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { NextFunction, Request, Response } from "express";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { Unauthorized } from "http-errors";
import { default as LRU } from "lru-cache";
import { db, log, User } from "./index.js";

const tokensCache = new LRU<string, DecodedIdToken | null>({
  ttl: 1000 * 60,
  max: 10000,
  allowStale: true,
  fetchMethod(idToken, staleValue) {
    return getAuth()
      .verifyIdToken(idToken, staleValue === undefined ? false : true)
      .catch((err) => {
        console.error(err);
        return null;
      });
  },
});

/**
 * Authentication middleware that authenticates requests based on a bearer token
 * contained in the `Authorization` HTTP header sent by the client app. Once the
 * user is authenticated, the currently logged in User object can be accessed
 * via `req.user` context variable, otherwise `req.user` is being set to `null`.
 *
 * @example
 *    const { getAuth } from "firebase/auth";
 *
 *    const user = await getAuth().currentUser?.getIdToken();
 *    const res = await fetch("/api", {
 *      method: "POST",
 *      headers: {
 *        ["Authorization"]: idToken ? `Bearer ${idToken}` : undefined },
 *        ["Content-Type"]: "application/json",
 *      },
 *      body: JSON.stringify({ query: "..." }),
 *    });
 */
export async function session(req: Request, res: Response, next: NextFunction) {
  try {
    // Set the currently logged in user object to `null` by default
    req.user = null;

    // Attempts to get an ID token from the `Authorization` HTTP header
    const idToken = req.headers.authorization?.match(/^[Bb]earer (\S+)/)?.[1];

    if (idToken) {
      // Verify if the ID token is valid
      const token = await tokensCache.fetch(idToken);

      if (!token) {
        throw new Unauthorized();
      }

      // Fetch the currently logged in User object from the database
      let user = await db.table<User>("user").where({ id: token.sub }).first();

      // Create the matching User record if it doesn't exist
      if (!user) {
        [user] = await db
          .table("user")
          .insert({
            id: token.sub,
            email: token.email,
            email_verified: token.email_verified,
          })
          .returning("*");
      }

      req.user = user ?? null;
    }

    next();
  } catch (err) {
    log(req, "WARNING", err as Error);
    res.status(401);
    res.end();
  }
}

export default session;
