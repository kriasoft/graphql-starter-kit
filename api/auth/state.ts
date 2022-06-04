/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { CompactSign, compactVerify } from "jose";
import { TextDecoder, TextEncoder } from "node:util";

const secret = "2pQRtrdv}TgL{3X{";

type State = { [key: string]: string | number };

/**
 * Creates an OAuth 2.0 state string using JWT.
 */
export async function createState(state: State): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(JSON.stringify(state));
  return await new CompactSign(data)
    .setProtectedHeader({ alg: "HS256" })
    .sign(enc.encode(secret));
}

/**
 * Decodes and verifies an OAuth 2.0 state using JWT.
 */
export async function verifyState(jws: string): Promise<State> {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const result = await compactVerify(jws, enc.encode(secret));
  return JSON.parse(dec.decode(result.payload));
}
