/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { execa as spawn } from "execa";
import { URL } from "node:url";
import { $, argv, chalk, fs, path, question } from "zx";

/**
 * This script can be used as a lightweight alternative to Terraform
 * for bootstrapping a new Google Cloud (GCP) project. Usage example:
 *
 *   $ yarn gcp:setup --env=test
 *   $ yarn gcp:setup --env=prod
 */

// Load the environment variables
const envName = argv.env ?? "test";
const env = envars.config({ env: envName });
const project = env.GOOGLE_CLOUD_PROJECT;
const region = env.GOOGLE_CLOUD_REGION;
const cwd = process.cwd();

await question(
  [
    chalk.grey(`Setting up the Google Cloud environment`),
    ``,
    `  ${chalk.bold(`Project`)}: ${chalk.green(project)}`,
    `  ${chalk.bold(`Region`)}: ${chalk.green(region)}`,
    ``,
    chalk.grey(`Click ${chalk.bold(`[Enter]`)} to continue...\n`),
  ].join("\n"),
);

// Get the GCP project number
const projectNum = await spawn("gcloud", [
  ...["projects", "list", `--filter`, project],
  ...["--format", "value(project_number)"],
]).then((cmd) => cmd.stdout.toString());

// The list of Google Cloud services that needs to be enabled
const services = [
  "iamcredentials.googleapis.com",
  "compute.googleapis.com",
  "cloudfunctions.googleapis.com",
  "logging.googleapis.com",
  "run.googleapis.com",
  "sqladmin.googleapis.com",
  "pubsub.googleapis.com",
  "cloudbuild.googleapis.com",
  "artifactregistry.googleapis.com",
  "sourcerepo.googleapis.com",
  "identitytoolkit.googleapis.com",
];

for (const service of services) {
  await $`gcloud services enable ${service} --project=${project}`;
}

let cmd = await spawn(`gsutil`, [`kms`, `serviceaccount`, `-p`, projectNum]);

// The list of IAM service accounts
const appAccount = `service@${project}.iam.gserviceaccount.com`; // GCS, URL signing
const computeAccount = `${projectNum}-compute@developer.gserviceaccount.com`; // GCF
const pubSubAccount = `service-${projectNum}@gcp-sa-pubsub.iam.gserviceaccount.com`;
const storageAccount = cmd.stdout.toString();

// Fetch the list of IAM service accounts
const serviceAccounts = await spawn("gcloud", [
  ...["iam", "service-accounts", "list"],
  ...["--project", project, "--format", "value(email)"],
]).then((cmd) => cmd.stdout.toString().split("\n").filter(Boolean));

// Create a custom service account for the app if not exists
if (!serviceAccounts.includes(appAccount)) {
  await $`gcloud iam service-accounts create ${appAccount.split("@")[0]} ${[
    ...["--project", project, "--display-name", "App Service"],
  ]}`;
}

async function addRole(iamAccount, role) {
  await $`gcloud projects add-iam-policy-binding ${project} ${[
    `--member=serviceAccount:${iamAccount}`,
    `--role=${role}`,
    `--format=none`,
  ]}`;
}

await addRole(pubSubAccount, "roles/iam.serviceAccountTokenCreator");
await addRole(storageAccount, "roles/pubsub.publisher");
await addRole(computeAccount, "roles/eventarc.eventReceiver");
await addRole(computeAccount, "roles/iam.serviceAccountTokenCreator");
await addRole(appAccount, "roles/iam.serviceAccountTokenCreator");
await addRole(appAccount, "roles/storage.objectAdmin");

// Fetch the list of service account keys
cmd = await spawn("gcloud", [
  ...["iam", "service-accounts", "keys", "list"],
  ...["--iam-account", appAccount, "--managed-by", "user"],
]);

// Create a new service account (JSON) key if not exists
if (!cmd.stdout.toString()) {
  await $`gcloud iam service-accounts keys create ${[
    path.resolve(__dirname, `../env/gcp-key.${envName}.json`),
    `--iam-account=${appAccount}`,
  ]}`;
}

// Get the primary domain name (from the production environment)
const prodEnv = envars.config({ env: "prod" });
const domain = new URL(prodEnv.APP_ORIGIN).hostname;

// Ensure that the domain name is verified
/* eslint-disable-next-line no-constant-condition */
while (true) {
  cmd = await spawn("gcloud", ["domains", "list-user-verified"]);
  const verifiedDomains = cmd.stdout.toString().split("\n").slice(1);
  if (verifiedDomains.includes(domain)) break;
  await $`gcloud domains verify ${domain} --project ${project}`;
  await question(chalk.grey(`Click ${chalk.bold(`[Enter]`)} to continue...\n`));
}

// Fetch the list of existing GCS buckets
cmd = await spawn("gcloud", ["alpha", "storage", "ls", "--project", project]);
const corsFile = path.relative(cwd, path.join(__dirname, "cors.json"));
const existingBuckets = cmd.stdout.toString().split("\n");
const buckets = Object.keys(env)
  .filter((key) => key.endsWith("_BUCKET"))
  .filter((key) => envName === "prod" || env[key] !== prodEnv[key])
  .map((key) => env[key]);

// Create missing GCS buckets if any
for (const bucket of buckets) {
  if (!existingBuckets.includes(`gs://${bucket}/`)) {
    await $`gsutil mb ${[
      ...["-p", project, "-l", region.split("-")[0], "-b", "on"],
      ...["-c", "standard", `gs://${bucket}/`],
    ]}`;
  }

  // Write CORS settings to a temporary file
  await fs.writeFile(
    corsFile,
    JSON.stringify([
      {
        origin: [
          env.APP_ORIGIN,
          envName !== "prod" && "http://localhost:3000",
        ].filter(Boolean),
        responseHeader: ["Content-Type"],
        method: ["GET"],
        maxAgeSeconds: 3600,
      },
    ]),
    { encoding: "utf-8" },
  );

  // Apply CORS settings to the target bucket
  try {
    await $`gsutil cors set ${corsFile} ${`gs://${bucket}`}`;
  } finally {
    await fs.unlink(corsFile);
  }
}
