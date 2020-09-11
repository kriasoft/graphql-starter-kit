/**
 * Compiles and bundles "api" package into "dist/api.zip".
 *
 * @see https://www.archiverjs.com/
 * @see https://babeljs.io/docs/en/babel-core
 * @see https://github.com/sindresorhus/globby
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const fs = require("fs");
const path = require("path");
const globby = require("globby");
const makeDir = require("make-dir");
const archiver = require("archiver");
const babel = require("@babel/core");
const pkg = require("../api/package.json");

// Match patterns of the files that needs to be included into the bundle
const match = [
  "**/*.(ts|hbs|json)",
  "!**/(__snapshots__|__tests__)",
  "!**/*.(d|test).ts",
  "!package.json",
  "!tsconfig.json",
];

// Location of the output bundle
const root = path.resolve(__dirname, "..");
const dest = path.join(root, "dist/api.zip");
const cwd = path.resolve(root, "api");

async function build() {
  // Ensure that the destination folder exists
  await makeDir(path.dirname(dest));

  // Create a new .zip archive
  const zip = archiver("zip");
  zip.pipe(fs.createWriteStream(dest));

  // Compiled and bundle application source code
  for await (const entry of globby.stream(match, { cwd, objectMode: true })) {
    if (entry.name.endsWith(".ts")) {
      const out = {
        name: `${entry.name.slice(0, -3)}.js`,
        path: `${entry.path.slice(0, -3)}.js`,
      };
      console.log(`${entry.path} -> ${out.path}`);
      const result = await babel.transformFileAsync(
        path.resolve(cwd, entry.path),
        { cwd, rootMode: "upward", envName: "production" },
      );
      const suffix = `\n//# sourceMappingURL=${out.name}.map`;
      zip.append(`${result.code}${suffix}`, { name: out.path });
      zip.append(JSON.stringify(result.map), { name: `${out.path}.map` });
    } else {
      console.log(entry.path);
      zip.file(path.resolve(cwd, entry.path), { name: entry.path });
    }
  }

  // Clean up and bundle package.json
  pkg.main = "index.js";
  delete pkg.devDependencies;
  delete pkg.jest;
  delete pkg.nodemonConfig;
  delete pkg.scripts;

  console.log("package.json");
  zip.append(JSON.stringify(pkg, null, "  "), { name: "package.json" });

  // Bundle Yarn CLI
  console.log(".yarnrc.yml");
  const file = path.resolve(root, ".yarnrc.yml");
  const text = await fs.promises.readFile(file, { encoding: "utf-8" });
  const yarnPath = text.match(/^yarnPath: (.*)$/m)[1];
  zip.append(`yarnPath: ${yarnPath}\n`, { name: ".yarnrc.yml" });
  console.log(yarnPath);
  zip.file(path.resolve(root, yarnPath), { name: yarnPath });

  await zip.finalize();

  console.log(`Output: ${path.relative(root, dest)} ${zip.pointer()} bytes`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
