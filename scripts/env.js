/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { load } from "ts-import";
import { loadEnv as loadViteEnv } from "vite";

// The root workspace folder
const rootDir = fileURLToPath(new URL("../", import.meta.url));

// Matches Google Secret Manager secret names
const secretRegExp = /^projects\/[\w-]+\/secrets\/[\w-]+\/versions\/[\w-]+/;

/**
 * Loads environment variables from the `.env` file(s).
 *
 * @param {string | undefined} mode Environment name such as "development" or "production"
 * @param {string} envFile Path to the `env.ts` file (using `envalid`)
 * @returns {Promise<void>}
 */
export async function loadEnv(mode, envFile) {
  const originalEnv = process.env;

  // Load environment variables from `.env` file(s) using Vite's `loadEnv()`
  // https://vitejs.dev/guide/api-javascript.html#loadenv
  const env = loadViteEnv(mode, rootDir, "");

  // Load the list of environment variables required by the application
  process.env = { ...process.env, ...env };
  const envModule = await load(envFile, {
    useCache: false,
    transpileOptions: {
      cache: { dir: resolve("./node_modules/.cache/ts-import") },
    },
  });

  // Restore the original environment variables
  process.env = originalEnv;

  // Initialize Google Secret Manager client
  // https://cloud.google.com/secret-manager/docs
  const sm = new SecretManagerServiceClient();

  // Add environment variables required by the application to the `process.env`
  await Promise.all(
    Object.keys(envModule.env ?? envModule.default ?? {}).map(async (key) => {
      if (env[key]) {
        if (secretRegExp.test(env[key])) {
          // Load the secret value from Google Secret Manager
          // https://cloud.google.com/secret-manager/docs/access-secret-version
          const [res] = await sm.accessSecretVersion({ name: env[key] });
          const secret = res.payload?.data?.toString();
          if (secret) process.env[key] = secret;
        } else {
          process.env[key] = env[key];
        }
      }
    }),
  );
}

loadEnv("development", "./env.ts");
