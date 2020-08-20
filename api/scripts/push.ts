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

const args = minimist(process.argv.slice(2));
const version = args.version ?? os.userInfo().username;
const target = `gs://${process.env.PKG_BUCKET}/${pkg.name}_${version}.zip`;

const p = spawn.sync("gsutil", ["cp", "package.zip", target], {
  stdio: "inherit",
});

process.exit(p.status || undefined);
