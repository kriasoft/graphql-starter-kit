/**
 * Uploads application bundle to Google Cloud Storage. Usage:
 *
 *   $ yarn deploy [--version=#0]
 *
 * @see https://console.cloud.google.com/storage/browser
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import "env";
import os from "os";
import spawn from "cross-spawn";
import minimist from "minimist";
import pkg from "../package.json";

const args = minimist(process.argv.slice(3));
const version = args.version ?? os.userInfo().username;
const target = `gs://${process.env.PKG_BUCKET}/${pkg.name}_${version}.js`;

console.log(`Uploading dist/main.js to ${target}...`);

const p = spawn.sync("gsutil", ["cp", "dist/main.js", target], {
  stdio: "inherit",
});

process.exit(p.status || undefined);
