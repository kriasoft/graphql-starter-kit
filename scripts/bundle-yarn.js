/**
 * Bundles Yarn CLI into a .zip archive.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const fs = require("fs");
const path = require("path");
const rootPath = path.resolve(__dirname, "..");

module.exports = async function bundleYarn(zip) {
  // Bundle a customized version of .yarnrc.yml
  console.log(".yarnrc.yml");
  let file = path.resolve(rootPath, ".yarnrc.yml");
  let source = await fs.promises.readFile(file, "utf-8");
  const yarnPath = source.match(/^yarnPath: (.*)$/m)[1];
  source = [
    `npmRegistryServer: https://registry.npmjs.org`,
    `enableAbsoluteVirtuals: true`,
    `enableColors: false`,
    `enableHyperlinks: false`,
    `enableInlineBuilds: true`,
    `enableProgressBars: false`,
    `enableTelemetry: false`,
    `yarnPath: ${yarnPath}`,
  ].join("\n");
  zip.append(source, { name: ".yarnrc.yml" });

  // Bundle .yarn/releases/yarn-x.x.x.cjs
  console.log(yarnPath);
  file = path.resolve(rootPath, yarnPath);
  source = await fs.promises.readFile(file, "utf-8");
  const fix = `process.argv.splice(3);`;
  source = [source.slice(0, 20), fix, source.slice(20)].join("");
  zip.append(source, { name: yarnPath });

  // TODO: Bundle yarn.lock
  console.log("yarn.lock");
  source = "__metadata:\n  version: 4\n  cacheKey: 6\n";
  zip.append(source, { name: "yarn.lock" });
};
