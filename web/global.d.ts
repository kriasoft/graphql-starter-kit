/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import "relay-runtime";

declare global {
  const APP_ENV: string;
  const APP_NAME: string;
  const APP_ORIGIN: string;
  const API_ORIGIN: string;
  const FIREBASE_AUTH_KEY: string;
  const GOOGLE_CLOUD_PROJECT: string;
  const GA_MEASUREMENT_ID: string;
}

declare module "relay-runtime" {
  interface PayloadError {
    errors?: Record<string, string[] | undefined>;
  }
}

declare module "*.css";
