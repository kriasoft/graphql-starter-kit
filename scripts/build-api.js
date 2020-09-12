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
const bundleYarn = require("./bundle-yarn");

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

  // Compile and bundle referenced workspaces
  pkg.workspaces = ["packages/db"];
  for (const file of ["db/types.d.ts", "db/package.json"]) {
    const filePath = path.resolve(root, file);
    const fileName = `packages/${file.replace(/(\.d\.ts|\.ts)$/, ".js")}`;
    console.log(fileName);
    if (file.endsWith(".ts")) {
      const result = await babel.transformFileAsync(filePath, {
        cwd: path.resolve(root, "db"),
        rootMode: "upward",
        envName: "production",
      });
      zip.append(result.code, { name: fileName });
    } else if (file === "db/package.json") {
      const src = JSON.parse(await fs.promises.readFile(filePath, "utf-8"));
      delete src.types;
      delete src.scripts;
      delete src.dependencies;
      delete src.devDependencies;
      zip.append(JSON.stringify(src, null, "  "), { name: fileName });
    }
  }

  // Clean up and bundle package.json
  pkg.main = "index.js";
  delete pkg.scripts;
  delete pkg.devDependencies;
  delete pkg.jest;

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
