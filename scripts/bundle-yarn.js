/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { execa } from "execa";
import { $, fs, globby, path } from "zx";

process.once("uncaughtException", (err) => {
  process.exit(err.exitCode ?? 1);
});

function toJSON(obj) {
  return JSON.stringify(obj, null, "  ");
}

// Copy package.json file
const pkg = JSON.parse(await fs.readFile("./package.json", "utf-8"));
delete pkg.scripts;
delete pkg.devDependencies;
delete pkg.babel;
delete pkg.envars;
await fs.writeFile("./dist/package.json", toJSON(pkg), "utf-8");

// Copy Yarn files
const yarnFiles = await globby(
  ["../yarn.lock", "../.yarnrc.yml", "../.yarn/releases", "../.yarn/plugins"],
  { dot: true },
);

await Promise.all(
  yarnFiles.map((file) => fs.copy(file, path.join("./dist/tmp", file))),
);

// Disable global cache in Yarn settings
await execa("yarn", ["config", "set", "enableGlobalCache", "false"], {
  env: { ...$.env, NODE_OPTIONS: undefined },
  stdio: "inherit",
  cwd: "./dist",
});

// Install Yarn dependencies
await execa("yarn", ["install"], {
  env: {
    ...$.env,
    NODE_OPTIONS: undefined,
    YARN_ENABLE_IMMUTABLE_INSTALLS: "false",
  },
  stdio: "inherit",
  cwd: "./dist",
});

// Clean up the output directory
await fs.remove("./dist/.yarn/install-state.gz");
await fs.remove("./dist/.yarn/unplugged");
