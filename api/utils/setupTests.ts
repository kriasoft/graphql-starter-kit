/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { cert, getApps, initializeApp } from "firebase-admin/app";

// Load Google Cloud credentials
// Load Google Cloud credentials
const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS ?? "{}");

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
