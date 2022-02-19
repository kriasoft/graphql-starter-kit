/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */
/*
 * This script helps to configure all the required
 * environment variables such as application URL (origin),
 * Google Cloud project IDs, database name, etc. Usage example:
 *
 *   $ yarn setup
 */

import spawn from "cross-spawn";
import crypto from "crypto";
import dotenv from "dotenv";
import inquirer from "inquirer";
import fs from "node:fs";

const environments = {
  prod: "production",
  test: "test (QA)",
  local: "local",
};

function replace(filename, searchValue, replaceValue) {
  let text = fs.readFileSync(filename, "utf8");
  if (text.match(searchValue)) {
    text = text.replace(searchValue, replaceValue);
    fs.writeFileSync(filename, text, "utf8");
    return true;
  } else {
    return `Failed to find ${searchValue} in ${filename}`;
  }
}

const questions = [
  {
    type: "confirm",
    name: "setup",
    message:
      "Configure this project for local development, test (QA), and production environments?",
    default: true,
  },
  {
    type: "input",
    name: "domain",
    message: "Domain name where the app will be hosted:",
    when: (answers) => answers.setup,
    default() {
      const { parsed } = dotenv.config({ path: "env/.prod.env" });
      return new URL(parsed.APP_ORIGIN).hostname;
    },
    validate(domain) {
      if (!domain.match(/^\w[\w-.]{0,61}\w\.[\w]{2,}$/)) {
        return "Requires a valid domain name.";
      }

      const appOrigin = /^(APP_ORIGIN)=.*$/m;
      const appName = /^(APP_NAME)=.*$/m;
      const appNameValue = domain
        .substring(0, domain.lastIndexOf("."))
        .replace(/\./g, "_");
      const pkgBucket = /^(PKG_BUCKET)=.*$/m;
      const emailFrom = /^(EMAIL_FROM)=.*$/m;
      const emailFromValue =
        appNameValue[0].toUpperCase() +
        appNameValue.substring(1) +
        ` <no-reply@${domain}>`;
      const emailReply = /^(EMAIL_REPLY_TO)=.*$/m;
      const emailReplyValue =
        appNameValue[0].toUpperCase() +
        appNameValue.substring(1) +
        ` <hello@${domain}>`;

      return (
        replace("env/.local.env", appName, `$1=${appNameValue}`) &&
        replace("env/.local.env", pkgBucket, `$1=pkg.${domain}`) &&
        replace("env/.local.env", emailFrom, `$1=${emailFromValue}`) &&
        replace("env/.local.env", emailReply, `$1=${emailReplyValue}`) &&
        replace("env/.test.env", appName, `$1=${appNameValue}`) &&
        replace("env/.test.env", appOrigin, `$1=https://test.${domain}`) &&
        replace("env/.test.env", pkgBucket, `$1=pkg.${domain}`) &&
        replace("env/.test.env", emailFrom, `$1=${emailFromValue}`) &&
        replace("env/.test.env", emailReply, `$1=${emailReplyValue}`) &&
        replace("env/.prod.env", appName, `$1=${appNameValue}`) &&
        replace("env/.prod.env", appOrigin, `$1=https://${domain}`) &&
        replace("env/.prod.env", pkgBucket, `$1=pkg.${domain}`) &&
        replace("env/.prod.env", emailFrom, `$1=${emailFromValue}`) &&
        replace("env/.prod.env", emailReply, `$1=${emailReplyValue}`)
      );
    },
  },
  {
    type: "input",
    name: "storage",
    message: "GCS bucket for user uploaded content (profile pictures, etc.):",
    when: (answers) => answers.setup,
    default: ({ domain }) => `s.${domain}`,
    validate(value) {
      if (!value.match(/^\w[\w-.]*\w$/)) {
        return "Requires a valid GCS bucket name.";
      }
      const storageBucket = /^(STORAGE_BUCKET)=.*/m;
      const uploadBucket = /^(UPLOAD_BUCKET)=.*/m;
      const uploadValue = value.replace(/^\w+./, "upload.");
      return (
        replace("env/.local.env", storageBucket, `$1=test-${value}`) &&
        replace("env/.local.env", uploadBucket, `$1=test-${uploadValue}`) &&
        replace("env/.test.env", storageBucket, `$1=test-${value}`) &&
        replace("env/.test.env", uploadBucket, `$1=test-${uploadValue}`) &&
        replace("env/.prod.env", storageBucket, `$1=${value}`) &&
        replace("env/.prod.env", uploadBucket, `$1=${uploadValue}`)
      );
    },
  },
  {
    type: "input",
    name: "cache",
    message: "GCS bucket for cached images:",
    when: (answers) => answers.setup,
    default: ({ domain }) => `c.${domain}`,
    validate(value) {
      if (!value.match(/^\w[\w-.]*\w$/)) {
        return "Requires a valid GCS bucket name.";
      }
      const cacheBucket = /^(CACHE_BUCKET)=.*/m;
      return (
        replace("env/.local.env", cacheBucket, `$1=test-${value}`) &&
        replace("env/.test.env", cacheBucket, `$1=test-${value}`) &&
        replace("env/.prod.env", cacheBucket, `$1=${value}`)
      );
    },
  },
  ...["prod", "test"].map((env) => ({
    type: "input",
    name: `gcp_project_${env}`,
    message: `GCP project ID for ${environments[env]} (${env}):`,
    when: (answers) => answers.setup,
    default: ({ domain }) =>
      domain
        .substring(0, domain.lastIndexOf("."))
        .replace(/\./g, "-")
        .toLowerCase() + `-${env}`,
    validate(value) {
      const gcp = /^(GOOGLE_CLOUD_PROJECT)=.*/gm;
      const db = /^(PGDATABASE)=.*/gm;
      const dbName = value.replace(/-/g, "_");
      const dbServer = /(PGSERVERNAME)=.*/gm;
      const localDb = dbName.replace(/_test/, "_local");
      return (
        replace(`env/.${env}.env`, gcp, `$1=${value}`) &&
        replace(`env/.${env}.env`, db, `$1=${dbName}`) &&
        replace(`env/.${env}.env`, dbServer, `$1=${value}:pg14`) &&
        (env === "test"
          ? replace(`env/.local.env`, gcp, `$1=${value}`) &&
            replace(`env/.local.env`, db, `$1=${localDb}`)
          : true)
      );
    },
  })),
  {
    type: "confirm",
    name: "clean",
    message: "Do you want to remove this setup script?",
    when: (answers) => answers.setup,
    default: false,
  },
];

async function done(answers) {
  // Remove this script
  if (answers.clean) {
    fs.unlinkSync("./setup.js");
    let text = fs.readFileSync("./package.json", "utf8");
    text = text.replace(/\n\s+"setup": ".*?\n/s, "\n");
    fs.writeFileSync("./package.json", text, "utf8");
    spawn.sync("yarn", ["remove", "inquirer", "cross-spawn", "dotenv"], {
      stdio: "inherit",
    });
  }

  if (answers.setup) {
    // Generate JWT secret(s)
    Object.keys(environments).forEach((env) => {
      let text = fs.readFileSync(`env/.${env}.env`, "utf8");
      let [, secret] = text.match(/^JWT_SECRET=(.*)/m) || [];
      if (secret === "n2127bOgmzao67RiW3umlVs16GL9fEj+JQRDaaN5E9G7yC/b") {
        secret = crypto.randomBytes(36).toString("base64");
        text = text.replace(/^(JWT_SECRET)=.*/m, `$1=${secret}`);
        fs.writeFileSync(`env/.${env}.env`, text, "utf8");
      }
    });

    console.log(`  `);
    console.log(
      `  Done! Now you can migrate the database and launch the app by running:`,
    );
  } else {
    console.log(`  `);
    console.log(`  No problem. You can run this script at any time later.`);
    console.log(
      `  Now you can migrate the database and launch the app by running:`,
    );
  }

  console.log(`  `);
  console.log(`  $ yarn db:reset`);
  console.log(`  $ yarn api:start`);
  console.log(`  $ yarn web:start`);
  console.log(`  `);
}

inquirer
  .prompt(questions)
  .then(done)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
