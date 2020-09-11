/**
 * Uploads application bundle to Google Cloud Storage. Usage:
 *
 *   $ yarn deploy [--version=#0]
 *
 * @see https://console.cloud.google.com/storage/browser
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

require("env");
const path = require("path");
const globby = require("globby");
const spawn = require("cross-spawn");
const minimist = require("minimist");

const { PKG_BUCKET } = process.env;
const { name } = require(path.resolve("package.json"));
const { version } = minimist(process.argv.splice(2), {
  default: { version: process.env.VERSION },
});

const files = globby.sync(`dist/${name}.(js|zip)`, {
  cwd: path.resolve(__dirname, ".."),
});

for (const file of files) {
  const name = path.basename(file).replace(/\.\w{2,3}$/, "");
  const target = `gs://${PKG_BUCKET}/${name}_${version}${path.extname(file)}`;
  console.log(`Uploading ${file} to ${target}...`);
  spawn("gsutil", ["cp", path.resolve(__dirname, "..", file), target], {
    stdio: "inherit",
  }).on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
}
