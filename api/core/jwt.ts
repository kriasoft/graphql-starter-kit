/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../env";

export function createIdToken(user: { id: string }): string {
  return jwt.sign({}, env.JWT_SECRET, {
    issuer: env.APP_ORIGIN,
    audience: env.APP_NAME,
    subject: String(user.id),
    expiresIn: env.JWT_EXPIRES,
  });
}

export function verifyIdToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET, {
    issuer: env.APP_ORIGIN,
    audience: env.APP_NAME,
    complete: false,
  }) as JwtPayload;
}

export function decodeIdToken(token: string): JwtPayload | null {
  return jwt.decode(token, { json: true });
}
