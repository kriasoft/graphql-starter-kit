/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { bool, cleanEnv, num, str, url } from "envalid";

const appName = process.env.APP_NAME?.replace(/^W/g, "");

/**
 * Ensures that all of the environment dependencies are met.
 *
 * @see https://github.com/af/envalid
 */
export default cleanEnv(process.env, {
  APP_NAME: str(),
  APP_ORIGIN: url(),
  APP_ENV: str({ choices: ["prod", "test", "local"] }),

  VERSION: str(),

  JWT_COOKIE: str({ default: "id" as string, devDefault: `id_${appName}` }),
  JWT_SECRET: str(),
  JWT_EXPIRES: num({ default: 60 * 60 * 24 * 14 /* 2 weeks */ }),

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

  EMAIL_FROM: str(),
  EMAIL_REPLY_TO: str(),
  SENDGRID_API_KEY: str(),

  UPLOAD_BUCKET: str(),
  STORAGE_BUCKET: str(),
});
