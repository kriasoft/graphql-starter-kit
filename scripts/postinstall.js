/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { execa as $ } from "execa";
import { EOL } from "node:os";
import { fs } from "zx";

if (process.env.CI === "true") process.exit();

process.cwd(__dirname);

const environments = [
  { name: "local", description: "development" },
  { name: "test", description: "staging/QA" },
  { name: "prod", description: "production" },
];

// Enable Git hooks
// https://typicode.github.io/husky/
await $("yarn", ["husky", "install"], { stdio: "inherit" });

// Create environment variable override files
// such as `env/.prod.override.env`.
for (const env of environments) {
  const filename = `./env/.${env.name}.override.env`;

  if (!fs.existsSync(filename)) {
    await fs.writeFile(
      filename,
      [
        `# Overrides for the "${env.name}" (${env.description}) environment`,
        `# PGPASSWORD=xxxxx`,
        `# GOOGLE_CLIENT_SECRET=xxxxx`,
        `# SENDGRID_API_KEY=SG.xxxxx`,
        ``,
      ].join(EOL),
      "utf-8",
    );
  }
}
