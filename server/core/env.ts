/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { cleanEnv, num, str, url } from "envalid";

/**
 * Validated and sanitized environment variables.
 *
 * @see https://github.com/af/envalid#readme
 */
export const env = cleanEnv(process.env, {
  /**
   * The port your HTTP server should listen on.
   * @default 8080
   */
  PORT: num({ default: 8080 }),
  /**
   * The name of the Cloud Run service being run.
   * @example server
   */
  K_SERVICE: str({ default: "" }),
  /**
   * The name of the Cloud Run revision being run.
   * @example server.1
   */
  K_REVISION: str({ default: "" }),
  /**
   * The name of the Cloud Run configuration that created the revision.
   * @example server
   */
  K_CONFIGURATION: str({ default: "" }),

  GOOGLE_CLOUD_PROJECT: str(),
  GOOGLE_CLOUD_REGION: str(),
  GOOGLE_CLOUD_CREDENTIALS: str({ default: "" }),
  FIREBASE_APP_ID: str(),
  FIREBASE_API_KEY: str(),
  FIREBASE_AUTH_DOMAIN: str(),

  APP_NAME: str(),
  APP_ORIGIN: url(),
  APP_ENV: str({ choices: ["prod", "test", "local"] }),

  VERSION: str({ default: "latest" }),

  PGHOST: str(),
  PGPORT: num({ default: 5432 }),
  PGUSER: str(),
  PGPASSWORD: str(),
  PGDATABASE: str(),

  SENDGRID_API_KEY: str(),
  EMAIL_FROM: str(),

  UPLOAD_BUCKET: str(),
  STORAGE_BUCKET: str(),
});
