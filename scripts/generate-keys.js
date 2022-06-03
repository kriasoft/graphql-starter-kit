/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */
/* eslint-disable no-undef */

import ora from "ora";
import { argv, cd, fs, path } from "zx";

// Change the current working directory to the project's root folder
cd(path.resolve(__dirname, ".."));

const envFile = `env/.${argv.env ?? "local"}.env`;
const spinner = ora(`Generating PUBLIC_KEY/PRIVATE_KEY env variables → ${envFile}...\n`).start(); // prettier-ignore

/**
 * Generates the cryptography key pair for the target environment. Usage:
 *
 *   $ yarn generate:keys [--env #0]
 */
const keyPair = await crypto.subtle.generateKey(
  {
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: 2048, // Can be 1024, 2048, or 4096
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: {
      // Can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      name: "SHA-256",
    },
  },
  true,
  ["sign", "verify"],
);

const publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
const privateKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

const env = await fs.readFile(envFile, { encoding: "utf-8" });

if (!env.match(/^PUBLIC_KEY=/m)) throw new Error("Not found: PUBLIC_KEY");
if (!env.match(/^PRIVATE_KEY=/m)) throw new Error("Not found: PRIVATE_KEY");

await fs.writeFile(
  envFile,
  env
    .replace(/^(PUBLIC_KEY)=.*$/im, `$1=${JSON.stringify(publicKey)}`)
    .replace(/^(PRIVATE_KEY)=.*$/im, `$1=${JSON.stringify(privateKey)}`),
  { encoding: "utf-8" },
);

spinner.succeed();
