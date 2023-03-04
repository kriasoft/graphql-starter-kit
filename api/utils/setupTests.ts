/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { readFileSync } from "node:fs";
import { dirname } from "node:path";

// Set the current working directory (CWD)
process.chdir(dirname(__dirname));

// Load Google Cloud credentials
const credentialsFile = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "";
const credentials = JSON.parse(readFileSync(credentialsFile, "utf8"));

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp({
    projectId: credentials.project_id,
    credential: cert({
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      privateKey: credentials.private_key,
    }),
  });
}
