/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import "relay-runtime";

declare global {
  const APP_ENV: string;
  const API_URL: string;
}

declare module "relay-runtime" {
  interface PayloadError {
    errors?: Record<string, string[] | undefined>;
  }
}

declare module "*.css";
