/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { bool, cleanEnv, json, num, str, url } from "envalid";

/**
 * Ensures that all of the environment dependencies are met.
 *
 * @see https://github.com/af/envalid
 */
export default cleanEnv(process.env, {
  GOOGLE_CLOUD_PROJECT: str(),
  GOOGLE_CLOUD_REGION: str(),

  APP_NAME: str(),
  APP_ORIGIN: url(),
  APP_ENV: str({ choices: ["prod", "test", "local"] }),

  VERSION: str(),

  PUBLIC_KEY: json(),
  PRIVATE_KEY: json(),
  SESSION_EXPIRES: num({ default: 60 * 60 * 24 * 30 /* 30 days */ }),

  PGHOST: str(),
  PGPORT: num({ default: 5432 }),
  PGUSER: str(),
  PGPASSWORD: str(),
  PGDATABASE: str(),
  PGSSLMODE: str({ choices: ["disable", "verify-ca"], default: "disable" }),
  PGSSLCERT: str({ default: "" }),
  PGSSLKEY: str({ default: "" }),
  PGSSLROOTCERT: str({ default: "" }),
  PGSERVERNAME: str({ default: "" }),
  PGAPPNAME: str({ default: "" }),
  PGDEBUG: bool({ default: false }),

  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),

  FACEBOOK_APP_ID: str(),
  FACEBOOK_APP_SECRET: str(),

  // GITHUB_APP_ID: str(),
  // GITHUB_APP_KEY: str(),
  // GITHUB_CLIENT_ID: str(),
  // GITHUB_CLIENT_SECRET: str(),

  EMAIL_FROM: str(),
  EMAIL_REPLY_TO: str(),
  SENDGRID_API_KEY: str(),

  UPLOAD_BUCKET: str(),
  STORAGE_BUCKET: str(),
});
