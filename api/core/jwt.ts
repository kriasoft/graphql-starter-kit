/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import {
  decodeJwt,
  importJWK,
  JWTPayload,
  jwtVerify,
  KeyLike,
  SignJWT,
} from "jose";
import env from "../env";

let privateKeyPromise: Promise<KeyLike | Uint8Array>;

export async function createIdToken(user: { id: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  return await new SignJWT({})
    .setProtectedHeader({ typ: "JWT", alg: "RS256" })
    .setIssuer(env.APP_ORIGIN)
    .setAudience(env.APP_ORIGIN)
    .setSubject(user.id)
    .setIssuedAt(now)
    .setExpirationTime(now + env.SESSION_EXPIRES)
    .sign(await getPrivateKey());
}

export async function verifyIdToken(token: string): Promise<JWTPayload> {
  const result = await jwtVerify(token, await getPrivateKey(), {
    issuer: env.APP_ORIGIN,
    audience: env.APP_ORIGIN,
  });

  return result.payload;
}

export function decodeIdToken(token: string): JWTPayload {
  return decodeJwt(token);
}

export async function getPrivateKey(): Promise<KeyLike | Uint8Array> {
  if (!privateKeyPromise) privateKeyPromise = importJWK(env.PRIVATE_KEY);
  return await privateKeyPromise;
}
