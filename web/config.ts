/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Client-side application settings.
 */
const config = {
  // Core application settings
  app: {
    env: `${process.env.APP_ENV}` as "local" | "test" | "prod",
    name: `${process.env.APP_NAME}`,
    origin: `${process.env.APP_ORIGIN}`,
  },
  // Firebase / Firestore (optional)
  // https://firebase.google.com/docs/firestore
  firebase: {
    authKey: `${process.env.FIREBASE_AUTH_KEY}`,
    authDomain: `https://${process.env.GOOGLE_CLOUD_PROJECT}.firebaseapp.com`,
    projectId: `${process.env.GOOGLE_CLOUD_PROJECT}`,
  },
  // Google Analytics
  // https://developers.google.com/analytics/devguides/collection
  gtag: {
    trackingID: `${process.env.GA_MEASUREMENT_ID}`,
    anonymizeIP: true,
  },
};

export default config;
export type Config = typeof config;
