/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Deploys web application bundle to Cloudflare. Usage:
 *
 *   $ yarn web:deploy [--version #0] [--env #0] [--no-download]
 *
 * @see https://developers.cloudflare.com/workers/
 * @see https://api.cloudflare.com/#worker-script-upload-worker
 */

import envars from "envars";
import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import { globby } from "globby";
import got from "got";
import minimist from "minimist";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listNamespaces } from "./cloudflare.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env;
const cwd = path.resolve(__dirname, "../web/dist/web");
const args = minimist(process.argv.slice(2), {
  default: { env: "test", version: env.VERSION, download: false },
});

// Load environment variables
envars.config({ env: args.env, cwd: path.resolve(__dirname, "../env") });

// The name of the worker script (e.g. "main", "main-test", etc.)
const name = `main${env.APP_ENV === "prod" ? "" : `-${env.APP_ENV}`}`;

// Configure an HTTP client for accessing Cloudflare REST API
const cf = got.extend({
  prefixUrl: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/`,
  headers: { authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}` },
  responseType: "json",
  resolveBodyOnly: true,
});

// Create a KV storage namespace
// https://api.cloudflare.com/#workers-kv-namespace-list-namespaces
const assetsNamespace =
  env.APP_NAME +
  (env.APP_ENV === `prod` ? `` : `_${env.APP_ENV}`) +
  (env.APP_ENV === `test` && args.version ? `_${args.version}` : ``);

const namespaces = await listNamespaces();
let ns = namespaces.find((x) => x.title === assetsNamespace);

if (!ns) {
  console.log(`Creating KV namespace: ${assetsNamespace}`);
  ns = await cf
    .post({ url: "storage/kv/namespaces", json: { title: assetsNamespace } })
    .then((x) => x.body);
}

// Upload website assets to KV storage.
// https://api.cloudflare.com/#workers-kv-namespace-write-multiple-key-value-pairs
console.log(`Uploading assets to KV storage: ${ns.title}, id: ${ns.id}`);

const files = await globby(["."], { cwd });

async function uploadNext() {
  while (files.length > 0) {
    const file = files.shift();
    console.log(`Uploading`, file);
    const form = new FormData();
    form.set("value", await fileFromPath(path.resolve(cwd, file)));
    form.set("metadata", JSON.stringify({}));
    await cf.put({
      url: `storage/kv/namespaces/${ns.id}/values/${file}`,
      body: form,
    });
  }
}

await Promise.all(Array.from({ length: 10 }, uploadNext));

// Upload the reverse proxy script to Cloudflare Workers.
console.log(`Uploading Cloudflare Worker script: ${name}`);

const form = new FormData();
form.set(
  "script",
  await fileFromPath(path.resolve(cwd, "../workers/proxy.js")),
);
form.set(
  "metadata",
  JSON.stringify({
    body_part: "script",
    bindings: [
      { type: "kv_namespace", name: "__STATIC_CONTENT", namespace_id: ns.id },
      { type: "plain_text", name: "__STATIC_CONTENT_MANIFEST", text: "false" },
    ],
  }),
);

await cf.put({
  url: `workers/scripts/${name}`,
  body: form,
  retry: { limit: 5 },
});

console.log("Done!");
