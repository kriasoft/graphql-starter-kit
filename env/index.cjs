/**
 * Loads environment variables from .env files into `process.env`.
 *
 * @see https://github.com/motdotla/dotenv
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const minimist = require("minimist");

const { env = "dev" } = minimist(process.argv.slice(2));

dotenv.config({ path: path.resolve(__dirname, `.env.${env}.override`) });
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });
dotenv.config({ path: path.resolve(__dirname, `.env`) });

// Load Google Cloud credentials
const gcpKey = path.resolve(__dirname, `gcp-key.${env}.json`);

if (fs.existsSync(gcpKey)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = gcpKey;
}

// Resolve relative paths to absolute
["PGSSLCERT", "PGSSLKEY", "PGSSLROOTCERT"].forEach((key) => {
  if (process.env[key] && process.env[key].startsWith(".")) {
    process.env[key] = path.resolve(__dirname, process.env[key]);
  }
});

// Ensure that the SSL key file has correct permissions
if (process.env.PGSSLKEY) {
  try {
    fs.chmodSync(process.env.PGSSLKEY, 0o600);
  } catch (err) {
    console.error(err);
  }
}
