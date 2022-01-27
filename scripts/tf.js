/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import chalk from "chalk";
import spawn from "cross-spawn";
import envars from "envars";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Load environment variables for the target Terraform workspace
// (GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_REGION, etc)
const TF_WORKSPACE = process.env.TF_WORKSPACE ?? "test";
const envName = TF_WORKSPACE === "prod" ? "prod" : "test";
const env = envars.config({ env: envName });

const { bold, red, blue } = chalk;
const cwd = path.join(fileURLToPath(import.meta.url), "../..");
const TF_DATA_DIR = path.join(cwd, ".terraform");
const TF_CLI_CONFIG_FILE = path.join(cwd, ".terraformrc");

// Show a friendly error when Terraform CLI was not found
process.on("uncaughtException", (/** @type {NodeJS.ErrnoException} */ err) => {
  if (err.code === "ENOENT") {
    console.error(
      [
        red("╷ "),
        red("│ ") + bold(`${red("Error:")} Terraform CLI not found`),
        red("│ "),
        red("│ ") + `For more information visit:`,
        red("│ ") +
          blue(`https://learn.hashicorp.com/tutorials/terraform/install-cli`),
        red("╵ "),
      ].join("\n"),
    );
    process.exitCode = 1;
  } else {
    throw err;
  }
});

// Create `.terraformrc` and `override.tf` files if don't exist
if (!fs.existsSync(TF_CLI_CONFIG_FILE)) {
  fs.writeFileSync(
    TF_CLI_CONFIG_FILE,
    [
      `# Terraform Cloud Credentials`,
      `# https://app.terraform.io/app/settings/tokens`,
      ``,
      `credentials "app.terraform.io" {`,
      `  token = "xxxxxx.atlasv1.zzzzzzzzzzzzz"`,
      `}`,
    ].join("\n"),
    "utf-8",
  );

  if (!fs.existsSync(path.join(cwd, "infra/override.tf"))) {
    fs.writeFileSync(
      path.join(cwd, "infra/override.tf"),
      [
        `# Terraform Configuration Overrides`,
        `# https://www.terraform.io/language/files/override`,
        ``,
      ].join("\n"),
      "utf-8",
    );
  }
}

const args = process.argv.slice(2);

// See `infra/variables.tf`
// https://www.terraform.io/language/values/variables
if (["plan", "apply", "import"].includes(args[0])) {
  fs.writeFileSync(
    path.join(cwd, "infra/.auto.tfvars.json"),
    JSON.stringify(
      {
        project: env.GOOGLE_CLOUD_PROJECT,
        region: env.GOOGLE_CLOUD_REGION,
        zone: env.GOOGLE_CLOUD_ZONE,
        cloudflare_account_id: env.CLOUDFLARE_ACCOUNT_ID,
        cloudflare_zone_id: env.CLOUDFLARE_ZONE_ID,
        cloudflare_api_token: env.CLOUDFLARE_API_TOKEN,
        database: env.PGDATABASE,
        database_password: env.PGPASSWORD,
        storage_bucket: env.STORAGE_BUCKET,
        upload_bucket: env.UPLOAD_BUCKET,
        cache_bucket: env.CACHE_BUCKET,
      },
      null,
      "  ",
    ),
    "utf-8",
  );
}

// Use `/infra` as the root directory
if (args[0]?.match(/^[a-z]/)) {
  args.splice(0, 0, `-chdir=infra`);
}

// Spawn a Terraform CLI process
spawn("terraform", args, {
  cwd,
  // https://www.terraform.io/cli/config/environment-variables
  env: { ...process.env, TF_DATA_DIR, TF_CLI_CONFIG_FILE, TF_WORKSPACE },
  stdio: "inherit",
}).on("exit", function (code) {
  if (code) process.exitCode = code;
});
