/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { getAuth } from "firebase-admin/auth";
import { got } from "got";
import { default as LRU } from "lru-cache";
import env from "../env.js";

const cache = new LRU<string, IdTokenResponse>({
  ttl: 3.3e6 /* 55 minutes */,
  max: 10000,
});

export async function verifyCustomToken(customToken: string) {
  const res = await got<IdTokenResponse>(
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken",
    {
      method: "POST",
      json: { token: customToken, returnSecureToken: true },
      searchParams: { key: env.FIREBASE_API_KEY },
      throwHttpErrors: false,
      responseType: "json",
    },
  );

  if (!res.ok) {
    const message = (res.body as ErrorResponse)?.error?.message;
    throw new Error(message ?? `${res.statusCode} ${res.statusMessage}`);
  }

  return res.body;
}

/**
 * Creates a user ID token to be used in unit tests.
 *
 * @param uid - The user ID to be used as the token's subject
 * @param claims - Optional additional claims to be included into the token's payload
 */
export async function createIdToken(
  uid: string,
  claims?: Record<string, unknown>,
): Promise<string> {
  let token = cache.get(uid);

  if (!token) {
    const auth = getAuth();
    const customToken = await auth.createCustomToken(uid, claims);
    token = await verifyCustomToken(customToken);
    cache.set(uid, token, {
      ttl: Number(token.expiresIn) * 1000 - 5 * 60 * 1000,
    });
  }

  if (!token.idToken) {
    throw new Error();
  }

  return token.idToken;
}

// #region TypeScript declarations

/**
 * Raw encoded JWT
 *
 */
export type IdToken = string;

/**
 * IdToken as returned by the API
 *
 * @internal
 */
type IdTokenResponse = {
  localId: string;
  idToken?: IdToken;
  refreshToken?: string;
  expiresIn?: string;
  providerId?: string;

  // Used in AdditionalUserInfo
  displayName?: string | null;
  isNewUser?: boolean;
  kind?: IdTokenResponseKind;
  photoUrl?: string | null;
  rawUserInfo?: string;
  screenName?: string | null;
};

/**
 * The possible types of the `IdTokenResponse`
 */
export const enum IdTokenResponseKind {
  CreateAuthUri = "identitytoolkit#CreateAuthUriResponse",
  DeleteAccount = "identitytoolkit#DeleteAccountResponse",
  DownloadAccount = "identitytoolkit#DownloadAccountResponse",
  EmailLinkSignin = "identitytoolkit#EmailLinkSigninResponse",
  GetAccountInfo = "identitytoolkit#GetAccountInfoResponse",
  GetOobConfirmationCode = "identitytoolkit#GetOobConfirmationCodeResponse",
  GetRecaptchaParam = "identitytoolkit#GetRecaptchaParamResponse",
  ResetPassword = "identitytoolkit#ResetPasswordResponse",
  SetAccountInfo = "identitytoolkit#SetAccountInfoResponse",
  SignupNewUser = "identitytoolkit#SignupNewUserResponse",
  UploadAccount = "identitytoolkit#UploadAccountResponse",
  VerifyAssertion = "identitytoolkit#VerifyAssertionResponse",
  VerifyCustomToken = "identitytoolkit#VerifyCustomTokenResponse",
  VerifyPassword = "identitytoolkit#VerifyPasswordResponse",
}

type ErrorResponse = {
  error?: {
    message?: string;
  };
};

// #endregion
