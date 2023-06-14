/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

declare module "__STATIC_CONTENT_MANIFEST" {
  const JSON: string;
  export default JSON;
}

declare type Bindings = {
  APP_ENV: "local" | "test" | "prod";
  APP_NAME: string;
  APP_HOSTNAME: string;
  APP_BUCKET?: string;
  API_ORIGIN: string;
  GOOGLE_CLOUD_PROJECT: string;
  GOOGLE_CLOUD_CREDENTIALS: string;
  FIREBASE_APP_ID: string;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  GA_MEASUREMENT_ID: string;
  __STATIC_CONTENT: KVNamespace;
};

declare type Env = {
  Bindings: Bindings;
};

declare function getMiniflareBindings<T = Bindings>(): T;

declare module "*.ejs" {
  /**
   * Generates HTML markup from an EJS template.
   *
   * @param locals an object of data to be passed into the template.
   * @param escape callback used to escape variables
   * @param include callback used to include files at runtime with `include()`
   * @param rethrow callback used to handle and rethrow errors
   *
   * @return Return type depends on `Options.async`.
   */
  const fn: (
    locals?: Data,
    escape?: EscapeCallback,
    include?: IncludeCallback,
    rethrow?: RethrowCallback,
  ) => string;
  export default fn;
}
