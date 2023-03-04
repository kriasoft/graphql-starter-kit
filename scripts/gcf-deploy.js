/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { execa } from "execa";
import { $, argv, chalk, fs, path } from "zx";
import { getArgs, saveEnvVars } from "./utils.js";

process.once("uncaughtException", (err) => {
  console.error(err);
  process.exitCode = err.exitCode ?? 1;
});

process.once("unhandledRejection", (err) => {
  console.error(err);
  process.exitCode = err.exitCode ?? 1;
});

// Parse the command line arguments and load environment variables
const [[name], envName = "test"] = getArgs();
envars.config({ env: envName });

// The name of the Cloud Function, e.g. "api" or "api-123" (preview)
const functionName = argv.pr ? `${name}-${argv.pr}` : name;
const serviceAccount = $.env[`${name}_SERVICE_ACCOUNT`];

// Load the list of environment variables required by the app
const app = await import(path.join(process.cwd(), "./dist/index.js"));
const envFile = `../.cache/${name}-${envName}.yml`;

// Save the required environment variables to .yml file before deployment
if (app.env) {
  const envEntries = Object.keys(app.env).map((key) => [key, $.env[key]]);
  await saveEnvVars(Object.fromEntries(envEntries), envFile, functionName);
  process.once("exit", () => fs.unlinkSync(envFile));
}

// Deploy to Google Cloud Functions (GCF)
await execa(
  "gcloud",
  [
    "functions",
    "deploy",
    functionName,
    `--project=${$.env.GOOGLE_CLOUD_PROJECT}`,
    `--region=${$.env.GOOGLE_CLOUD_REGION}`,
    "--allow-unauthenticated",
    argv.gen2 !== false && "--gen2",
    `--entry-point=${argv.entry}`,
    "--memory=1Gi",
    "--runtime=nodejs18",
    serviceAccount && `--service-account=${serviceAccount}`,
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
let cmd = await execa(
  "gcloud",
  [
    "functions",
    "describe",
    functionName,
    `--project=${$.env.GOOGLE_CLOUD_PROJECT}`,
    `--region=${$.env.GOOGLE_CLOUD_REGION}`,
    "--format=value(serviceConfig.uri)",
    argv.gen2 !== false && "--gen2",
  ].filter(Boolean),
);

if (cmd.exitCode !== 0) {
  console.error(cmd.stderr || cmd.stdout);
  process.exit(cmd.exitCode);
}

const deployedURI = cmd.stdout.trim();

console.log(`Deployed to ${chalk.blueBright(deployedURI)}`);

// if (name === "api" && argv.pr) {
//   const previewBucket = $.env.APP_BUCKET?.replace(/^test\./, "preview.");
//   const file = `gs://${previewBucket}/${argv.pr}/api.txt`;
//   cmd = execa("gsutil", ["cp", "-", file]);
//   cmd.stdout.pipe(process.stdout);
//   cmd.stderr.pipe(process.stderr);
//   cmd.stdin.write(deployedURI);
//   cmd.stdin.end();
//   await cmd;
// }
