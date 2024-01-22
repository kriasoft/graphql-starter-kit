/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { execa } from "execa";
import { EOL } from "node:os";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { fs } from "zx";

if (process.env.CI === "true") process.exit();

export const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
process.cwd(rootDir);

// Enable Git hooks
// https://typicode.github.io/husky/
await execa("yarn", ["husky", "install"], { stdio: "inherit" });

// Create environment variable override files
// such as `env/.prod.override.env`.
const envFile = `./.env.local`;

if (!fs.existsSync(envFile)) {
  await fs.writeFile(
    envFile,
    [
      `# Environment variables overrides for local development`,
      `#`,
      `# GOOGLE_CLOUD_CREDENTIALS=xxxxx`,
      "# CLOUDFLARE_API_TOKEN=xxxxx",
      `# SENDGRID_API_KEY=SG.xxxxx`,
      `# PGPASSWORD=xxxxx`,
      ``,
    ].join(EOL),
    "utf-8",
  );
}

try {
  await execa("yarn", ["tsc", "--build"], { stdin: "inherit" });
} catch (err) {
  console.error(err);
}
