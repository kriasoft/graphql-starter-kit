/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { execa } from "execa";
import { $, argv, chalk, fs, path, YAML } from "zx";

process.once("uncaughtException", (err) => {
  console.error(err);
  process.exitCode = err.exitCode ?? 1;
});

process.once("unhandledRejection", (err) => {
  console.error(err);
  process.exitCode = err.exitCode ?? 1;
});

// Load environment variables
const name = argv._[0];
const envName = argv.env || "test";
envars.config({ env: envName });

const envFile = `../.cache/${name}-${envName}.yml`;
const app = await import(path.join(process.cwd(), "./dist/index.js"));

// Save the required environment variables to .yml file before deployment
if (app.env) {
  const envEntries = Object.keys(app.env).map((key) => [key, $.env[key]]);
  const envYAML = YAML.stringify(Object.fromEntries(envEntries));
  await fs.writeFile(envFile, envYAML, "utf-8");
  process.on("exit", () => fs.unlinkSync(envFile));
}

// Deploy to Google Cloud Functions (GCF)
await execa(
  "gcloud",
  [
    "functions",
    "deploy",
    argv.pr ? `${name}-${argv.pr}` : name,
    `--project=${$.env.GOOGLE_CLOUD_PROJECT}`,
    `--region=${$.env.GOOGLE_CLOUD_REGION}`,
    "--allow-unauthenticated",
    argv.gen2 !== false && "--gen2",
    `--entry-point=${argv.entry}`,
    "--memory=1Gi",
    "--runtime=nodejs18",
    "--source=./dist",
    "--timeout=30",
    app.env && `--env-vars-file=${envFile}`,
    "--min-instances=0", // TODO: Set to 1 for production
    "--max-instances=2",
    "--trigger-http",
  ].filter(Boolean),
  { stdio: "inherit" },
);

// Fetch the URL of the deployed Cloud Function
let cmd = await execa("gcloud", [
  "functions",
  "describe",
  argv.pr ? `${name}-${argv.pr}` : name,
  `--project=${$.env.GOOGLE_CLOUD_PROJECT}`,
  `--region=${$.env.GOOGLE_CLOUD_REGION}`,
  "--format=value(serviceConfig.uri)",
  "--gen2",
]);

if (cmd.exitCode !== 0) {
  console.error(cmd.stderr || cmd.stdout);
  process.exit(cmd.exitCode);
}

const deployedURI = cmd.stdout.trim();

console.log(`Deployed to ${chalk.blueBright(deployedURI)}`);

if (name === "api" && argv.pr) {
  const previewBucket = $.env.APP_BUCKET?.replace(/^test\./, "preview.");
  const file = `gs://${previewBucket}/${argv.pr}/api.txt`;
  cmd = execa("gsutil", ["cp", "-", file]);
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.stdin.write(deployedURI);
  cmd.stdin.end();
  await cmd;
}
