/**
 * Bundles the "web" package into "dist/web.zip".
 *
 * @see https://www.archiverjs.com/
 * @see https://github.com/sindresorhus/globby
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const fs = require("fs");
const path = require("path");
const globby = require("globby");
const makeDir = require("make-dir");
const archiver = require("archiver");

const pkg = require("../web/package.json");
const bundleYarn = require("./bundle-yarn");

// Match patterns of the files that needs to be included into the bundle
const match = [".next/**/*", "!.next/cache", "next.config.js", "server.js"];

// Location of the output bundle
const root = path.resolve(__dirname, "..");
const dest = path.join(root, "dist/web.zip");
const cwd = path.resolve(root, "web");

async function build() {
  // Ensure that the destination folder exists
  await makeDir(path.dirname(dest));

  // Create a new .zip archive
  const zip = archiver("zip");
  zip.pipe(fs.createWriteStream(dest));

  // Compiled and bundle application source code
  for await (const entry of globby.stream(match, { cwd, objectMode: true })) {
    console.log(entry.path);
    zip.file(path.resolve(cwd, entry.path), { name: entry.path });
  }

  // Clean up and bundle package.json
  delete pkg.scripts;
  delete pkg.devDependencies;
  delete pkg.eslintConfig;

  console.log("package.json");
  zip.append(JSON.stringify(pkg, null, "  "), { name: "package.json" });

  await bundleYarn(zip);
  await zip.finalize();

  console.log(`Output: ${path.relative(root, dest)} ${zip.pointer()} bytes`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
