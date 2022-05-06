/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import spawn from "cross-spawn";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import { EOL } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const environments = [
  { name: "local", description: "development" },
  { name: "test", description: "staging/QA" },
  { name: "prod", description: "production" },
];

// Enable Git hooks
// https://typicode.github.io/husky/
spawn.sync("yarn", ["husky", "install"], { stdio: "inherit" });

// Create environment variable override files
// such as `env/.prod.override.env`.
for (const env of environments) {
  const filename = join(__dirname, `../env/.${env.name}.override.env`);

  if (!existsSync(filename)) {
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
