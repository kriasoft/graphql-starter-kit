/**
 * This script helps to configure all the required
 * environment variables such as application URL (origin),
 * Google Cloud project IDs, database name, etc. Usage example:
 *
 *   $ yarn setup
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const fs = require("fs");
const crypto = require("crypto");
const dotenv = require("dotenv");
const spawn = require("cross-spawn");
const inquirer = require("inquirer");

const environments = {
  prod: "production",
  test: "test (QA)",
  dev: "development",
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
      "Configure this project for production, test (QA), and shared development environments?",
    default: true,
  },
  {
    type: "input",
    name: "domain",
    message: "Domain name where the app will be hosted:",
    when: (answers) => answers.setup,
    default() {
      const { parsed } = dotenv.config({ path: "env/.env.prod" });
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

      return (
        replace("env/.env.prod", appOrigin, `$1=https://${domain}`) &&
        replace("env/.env.test", appOrigin, `$1=https://test.${domain}`) &&
        replace("env/.env.dev", appOrigin, `$1=https://dev.${domain}`) &&
        replace("env/.env", appName, `$1=${appNameValue}`)
      );
    },
  },
  {
    type: "input",
    name: "pkg",
    message: "GCS bucket for the app bundles:",
    when: (answers) => answers.setup,
    default: ({ domain }) => `pkg.${domain}`,
    validate(value) {
      if (!value.match(/^\w[\w-.]*\w$/)) {
        return "Requires a valid GCS bucket name.";
      }
      const search = /^(PKG_BUCKET)=.*/m;
      return replace("env/.env", search, `$1=${value}`);
    },
  },
  {
    type: "input",
    name: "storage",
    message: "GCS bucket for user uploaded content:",
    when: (answers) => answers.setup,
    default: ({ domain }) => `s.${domain}`,
    validate(value) {
      if (!value.match(/^\w[\w-.]*\w$/)) {
        return "Requires a valid GCS bucket name.";
      }
      const search = /^(STORAGE_BUCKET)=.*/m;
      return (
        replace("env/.env.prod", search, `$1=${value}`) &&
        replace("env/.env.test", search, `$1=test-${value}`) &&
        replace("env/.env.dev", search, `$1=dev-${value}`) &&
        replace("env/.env.local", search, `$1=dev-${value}`)
      );
    },
  },
  ...Object.keys(environments).map((env) => ({
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
      const localDb = dbName.replace(/_(dev|development)/, "_local");
      return (
        replace(`env/.env.${env}`, gcp, `$1=${value}`) &&
        replace(`env/.env.${env}`, db, `$1=${dbName}`) &&
        replace(`env/.env.${env}`, dbServer, `$1=${value}:pg12`) &&
        (env === "dev"
          ? replace(`env/.env.local`, gcp, `$1=${value}`) &&
            replace(`env/.env.local`, db, `$1=${localDb}`)
          : true)
      );
    },
  })),
  {
    type: "confirm",
    name: "yarn",
    message: "Enable Yarn Zero-install?",
    default: true,
  },
  {
    type: "confirm",
    name: "clean",
    message: "Do you want to remove this setup script?",
    when: (answers) => answers.setup,
    default: false,
  },
];

async function done(answers) {
  // Enable/disable Yarn Zero-install
  if (answers.yarn) {
    await replace(`.gitignore`, /^#!\.yarn\/cache$/m, `!.yarn/cache`);
    await replace(`.gitignore`, /^\.pnp\.\*$/m, `#.pnp.*`);
    await replace(
      `.github/workflows/pull_request.yaml`,
      /yarn install$/m,
      `yarn install --immutable --immutable-cache`,
    );
  } else {
    await replace(`.gitignore`, /^!\.yarn\/cache$/m, `#!.yarn/cache`);
    await replace(`.gitignore`, /^#\.pnp\.\*$/m, `.pnp.*`);
    await replace(
      `.github/workflows/pull_request.yaml`,
      /yarn install.*$/m,
      `yarn install`,
    );
  }

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
      let text = fs.readFileSync(`env/.env.${env}`, "utf8");
      let [, secret] = text.match(/^JWT_SECRET=(.*)/m) || [];
      if (secret === "n2127bOgmzao67RiW3umlVs16GL9fEj+JQRDaaN5E9G7yC/b") {
        secret = crypto.randomBytes(36).toString("base64");
        text = text.replace(/^(JWT_SECRET)=.*/m, `$1=${secret}`);
        fs.writeFileSync(`env/.env.${env}`, text, "utf8");
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
