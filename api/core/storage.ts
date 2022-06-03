/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Storage } from "@google-cloud/storage";
import env from "../env";

// Use a service account key (credentials) to simplify local testing
export const storage = new Storage({
  projectId: env.GOOGLE_CLOUD_PROJECT,
  credentials: env.GOOGLE_CLOUD_CREDENTIALS,
});

export const uploadBucket = storage.bucket(env.UPLOAD_BUCKET);
export const storageBucket = storage.bucket(env.STORAGE_BUCKET);
