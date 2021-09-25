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

const fs = require("fs");
const got = require("got");
const path = require("path");
const globby = require("globby");
const envars = require("envars");
const minimist = require("minimist");
const FileType = require("file-type");
const FormData = require("form-data");

const env = process.env;
const cwd = path.resolve(__dirname, "../web/dist/web");
const args = minimist(process.argv.slice(2), {
  default: { env: "test", version: env.VERSION, download: false },
});

envars.config({ env: args.env, cwd: path.resolve(__dirname, "../env") });

// The name of the worker script (e.g. "main", "main-test", etc.)
const name = `main${env.APP_ENV === "prod" ? "" : `-${env.APP_ENV}`}`;

// Configure an HTTP client for accessing Cloudflare REST API
const cf = got.extend({
  prefixUrl: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/`,
  headers: {
    authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
    "user-agent": "https://git.io/Jt7GM",
  },
  responseType: "json",
  resolveBodyOnly: true,
  hooks: {
    afterResponse: [
      (res) => {
        if (!res.body?.success) throw new Error(res.body.errors[0].message);
        res.body?.messages.forEach((x) => console.log(x));
        res.body = res.body.result || res.body;
        return res;
      },
    ],
  },
});

async function deploy() {
  /*
   * Optionally, download previously compiled assets.
   * https://googleapis.dev/nodejs/storage/latest/
   */

  // if (process.env.CI === "true" || args.download) {
  //   const file = `web_${args.version}.zip`;
  //   console.log(`Downloading gs://${env.PKG_BUCKET}/${file}`);
  //   const [contents] = await new Storage()
  //     .bucket(env.PKG_BUCKET)
  //     .file(file)
  //     .download();
  //   fs.writeFileSync(path.resolve(cwd, "../web.zip"), contents);
  //   // TODO: Unzip
  // }

  /*
   * Create a KV storage namespace.
   * https://api.cloudflare.com/#workers-kv-namespace-list-namespaces
   */

  const assetsNamespace =
    env.APP_NAME +
    (env.APP_ENV === `prod` ? `` : `_${env.APP_ENV}`) +
    (env.APP_ENV === `test` && args.version ? `_${args.version}` : ``);

  let res = await cf.get({ url: "storage/kv/namespaces" });
  let ns = res.find((x) => x.title === assetsNamespace);

  if (!ns) {
    console.log(`Creating KV namespace: ${assetsNamespace}`);
    ns = await cf.post({
      url: "storage/kv/namespaces",
      json: { title: assetsNamespace },
    });
  }

  /*
   * Upload website assets to KV storage.
   * https://api.cloudflare.com/#workers-kv-namespace-write-multiple-key-value-pairs
   */

  console.log(`Uploading assets to KV storage: ${ns.title}, id: ${ns.id}`);

  const files = await globby(["."], { cwd });

  for (let i = 0; i < files.length; i++) {
    const data = fs.readFileSync(path.resolve(cwd, files[i]));
    const type = await FileType.fromBuffer(data);
    files[i] = type
      ? { key: files[i], value: data.toString("base64"), base64: true }
      : { key: files[i], value: data.toString("utf-8") };
  }

  await cf.put({ url: `storage/kv/namespaces/${ns.id}/bulk`, json: files });

  /*
   * Upload the reverse proxy script to Cloudflare Workers.
   */

  console.log(`Uploading Cloudflare Worker script: ${name}`);

  const form = new FormData();
  const script = fs.readFileSync(
    path.resolve(cwd, "../workers/proxy.js"),
    "utf-8",
  );
  const bindings = [
    { type: "kv_namespace", name: "__STATIC_CONTENT", namespace_id: ns.id },
    { type: "plain_text", name: "__STATIC_CONTENT_MANIFEST", text: "false" },
  ];
  const metadata = { body_part: "script", bindings };
  form.append("script", script, { contentType: "application/javascript" });
  form.append("metadata", JSON.stringify(metadata), {
    contentType: "application/json",
  });

  await cf.put({
    url: `workers/scripts/${name}`,
    headers: form.getHeaders(),
    body: form,
  });

  console.log("Done!");
}

deploy().catch((err) => {
  console.error(err);
  process.exit(1);
});
