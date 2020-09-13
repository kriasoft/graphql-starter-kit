/**
 * Deploys application bundle to Cloudflare. Usage:
 *
 *   $ yarn deploy [--version=#0] [--env=#1] [--no-download]
 *
 * @see https://developers.cloudflare.com/workers/
 * @see https://api.cloudflare.com/#worker-script-upload-worker
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

require("env");
const fs = require("fs");
const got = require("got");
const path = require("path");
const spawn = require("cross-spawn");
const minimist = require("minimist");

const { name } = require("../proxy/package.json");

const env = process.env;
const root = path.resolve(__dirname, "..");
const args = minimist(process.argv.slice(2), {
  default: { env: "dev", version: env.VERSION, download: true },
});
const source = `gs://${env.PKG_BUCKET}/${name}_${args.version}.js`;
const script = `${name}${args.env === "prod" ? "" : `-${args.env}`}`;

// Optionally, download the bundle from GCS bucket
if (args.download) {
  const p = spawn.sync("gsutil", ["cp", source, `dist/${name}.js`], {
    cwd: root,
    stdio: "inherit",
  });

  if (p.error) console.error(p.error);
  if (p.status !== 0) process.exit(p.status || 1);

  console.log(`Deploying ${source} to workers/scripts/${script}...`);
} else {
  console.log(`Deploying dist/${name}.js to workers/scripts/${script}...`);
}

const cf = got.extend({
  prefixUrl: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/`,
  headers: {
    Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
    "Content-Type": "application/javascript",
  },
  responseType: "json",
});

cf.put({
  url: `workers/scripts/${script}`,
  body: fs.readFileSync(path.resolve(root, `dist/${name}.js`), "utf-8"),
})
  .then(({ body }) => {
    if (body.success) {
      delete body.result.script;
      console.log(body.result);
    } else {
      throw new Error(body.errors[0]);
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
