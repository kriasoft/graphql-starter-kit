/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { bool, cleanEnv, num, str, url } from "envalid";

/**
 * Environment variables
 *
 * @see https://github.com/af/envalid#readme
 */
export default cleanEnv(process.env, {
  GOOGLE_CLOUD_PROJECT: str(),
  GOOGLE_CLOUD_REGION: str(),
  FIREBASE_API_KEY: str(),

  APP_NAME: str(),
  APP_ORIGIN: url(),
  APP_ENV: str({ choices: ["prod", "test", "local"] }),

  VERSION: str({ default: "latest" }),

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

  SENDGRID_API_KEY: str(),
  EMAIL_FROM: str(),

  UPLOAD_BUCKET: str(),
  STORAGE_BUCKET: str(),
});
