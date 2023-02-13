/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

declare module "__STATIC_CONTENT_MANIFEST" {
  const JSON: string;
  export default JSON;
}

declare type Env = {
  APP_ENV: "local" | "test" | "prod";
  APP_NAME: string;
  APP_HOSTNAME: string;
  APP_BUCKET?: string;
  API_ORIGIN: string;
  GOOGLE_CLOUD_PROJECT: string;
  FIREBASE_APP_ID: string;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  __STATIC_CONTENT: Record<string, string>;
};

declare function getMiniflareBindings<Bindings = Env>(): Bindings;
