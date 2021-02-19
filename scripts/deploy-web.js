/**
 * Deploys application bundle to Cloudflare. Usage:
 *
 *   $ yarn deploy [--version #0] [--env #0] [--no-download]
 *
 * @see https://developers.cloudflare.com/workers/
 * @see https://api.cloudflare.com/#worker-script-upload-worker
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

require("env");
const fs = require("fs");
const got = require("got");
const path = require("path");
const globby = require("globby");
const minimist = require("minimist");
const { Storage } = require("@google-cloud/storage");

const env = process.env;
const args = minimist(process.argv.slice(2), {
  default: { env: "dev", version: env.VERSION, download: false },
});

// The name of the worker script (e.g. "proxy", "proxy-test", etc.)
const name = `proxy${args.env === "prod" ? "" : `-${args.env}`}`;

// Configure an HTTP client for accessing Cloudflare REST API
const cf = got.extend({
  prefixUrl: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/`,
  headers: {
    Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
    "Content-Type": "application/javascript",
  },
  responseType: "json",
});

async function deploy() {
  const storage = new Storage();

  /*
   * Upload application (static) files to a cloud storage bucket.
   * Example: `dist/web/**` => `gs://s.example.com/app/`
   */

  const appBucket = storage.bucket(env.STORAGE_BUCKET);
  const files = await globby(".", { cwd: "../dist/web" });

  async function upload() {
    let filename;

    while ((filename = files.shift())) {
      console.log(filename);
      await appBucket.upload(path.resolve(__dirname, "../dist/web", filename), {
        destination: `app/${filename}`,
        public: true,
      });
    }
  }

  await Promise.all(Array.from({ length: 5 }).map(() => upload()));

  /*
   * Upload the reverse proxy script to Cloudflare Workers.
   */

  let source;

  if (process.env.CI === "true" || args.download) {
    console.log(`Downloading proxy_${args.version}.js from ${env.PKG_BUCKET}`);
    source = await storage
      .bucket(env.PKG_BUCKET)
      .file(`proxy_${args.version}.js`)
      .download()
      .then((x) => x[0].toString());
  } else {
    source = fs.readFileSync(
      path.resolve(__dirname, "../dist/proxy/proxy.js"),
      "utf8",
    );
  }

  const res = await cf.put({ url: `workers/scripts/${name}`, body: source });

  if (res.body.success) {
    delete res.body.result.script;
    console.log("Successfully deployed!");
    console.log(res.body.result);
  } else {
    throw new Error(res.body.errors[0]);
  }
}

deploy().catch((err) => {
  console.error(err);
  process.exit(1);
});
