/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import jwt from "jsonwebtoken";

const secret = "2pQRtrdv}TgL{3X{";

type State = { [key: string]: string | number };

/**
 * Creates an OAuth 2.0 state string using JWT.
 */
export function createState(state: State): string {
  return jwt.sign(state, secret, { expiresIn: "1h" });
}

/**
 * Decodes and verifies an OAuth 2.0 state using JWT.
 */
export function verifyState(state: string): State {
  return jwt.verify(state, secret) as State;
}
