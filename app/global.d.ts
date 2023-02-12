/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import "relay-runtime";

interface Window {
  dataLayer: unknown[];
}

interface ImportMetaEnv {
  readonly VITE_APP_ENV: "prod" | "test" | "dev" | "local";
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_ORIGIN: string;
  readonly VITE_GOOGLE_CLOUD_PROJECT: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
}

declare module "relay-runtime" {
  interface PayloadError {
    errors?: Record<string, string[] | undefined>;
  }
}

declare module "*.css";
