/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Client-side application settings for the local development environment.
 */
const local = {
  // Core application settings
  app: {
    name: "Example",
    origin: "http://localhost:3000",
    env: "local" as "local" | "test" | "prod",
  },
  // GraphQL API and OAuth endpoint(s)
  api: {
    origin: "http://localhost:8080",
    prefix: "",
    path: "/api",
  },
  // Firebase / Firestore (optional)
  // https://firebase.google.com/docs/firestore
  firebase: {
    authKey: "xxxxx",
    authDomain: "https://example-test.firebaseapp.com",
    projectId: "example-test",
  },
  // Google Analytics
  // https://developers.google.com/analytics/devguides/collection
  gtag: {
    trackingID: "G-XXXXXXXX",
    anonymizeIP: true,
  },
};

/**
 * Client-side application settings for the test / QA environment.
 */
const test: typeof local = {
  app: {
    ...local.app,
    origin: "https://test.example.com",
    env: "test",
  },
  api: {
    ...local.api,
    origin: "https://us-central1-example-test.cloudfunctions.net",
  },
  firebase: {
    authKey: "xxxxx",
    authDomain: "https://example-test.firebaseapp.com",
    projectId: "example-test",
  },
  gtag: local.gtag,
};

/**
 * Client-side application settings for the production environment.
 */
const prod: typeof local = {
  app: {
    ...local.app,
    origin: "https://example.com",
    env: "prod",
  },
  api: {
    ...local.api,
    origin: "https://us-central1-example.cloudfunctions.net",
  },
  firebase: {
    authKey: "xxxxx",
    authDomain: "https://example.firebaseapp.com",
    projectId: "example",
  },
  gtag: local.gtag,
};

export type Config = typeof local;
export { local, test, prod };
export default { local, test, prod };
