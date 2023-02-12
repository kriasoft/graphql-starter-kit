/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { getApps, initializeApp } from "firebase-admin/app";
import path from "node:path";
import env from "../env.js";

// Set the current working directory (CWD)
process.chdir(path.dirname(__dirname));

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp({ projectId: env.GOOGLE_CLOUD_PROJECT });
}
