/**
 * Deploys application bundle to Cloudflare. Usage:
 *
 *   $ yarn deploy [--version=#0] [--env=#1] [--no-download]
 *
 * @see https://developers.cloudflare.com/workers/
 * @see https://api.cloudflare.com/#worker-script-upload-worker
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import "env";
import fs from "fs";
import os from "os";
import got from "got";
import spawn from "cross-spawn";
import minimist from "minimist";

import pkg from "../package.json";

const args = minimist(process.argv.slice(3));
const version = args.version ?? os.userInfo().username;
const source = `gs://${process.env.PKG_BUCKET}/${pkg.name}_${version}.js`;
const script = ["prod", "production"].includes(args.env)
  ? pkg.name
  : `${pkg.name}-${args.env || "dev"}`;

// Optionally, download the bundle from GCS bucket
if (args.download !== false) {
  const p = spawn.sync("gsutil", ["cp", source, "dist/main.js"], {
    stdio: "inherit",
  });

  if (p.status) process.exit(p.status);

  console.log(`Deploying ${source} to ${script}...`);
} else {
  console.log(`Deploying dist/main.js to ${script}...`);
}

const cf = got.extend({
  prefixUrl: `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/`,
  headers: {
    Authorization: `Bearer ${process.env.CF_TOKEN}`,
    "Content-Type": "application/javascript",
  },
});

cf.put({
  url: `workers/scripts/${script}`,
  body: fs.readFileSync(`dist/main.js`, "utf8"),
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
