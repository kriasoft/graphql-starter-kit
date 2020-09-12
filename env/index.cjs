/**
 * Loads environment variables from .env files into `process.env`.
 *
 * @see https://github.com/motdotla/dotenv
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const os = require("os");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const minimist = require("minimist");
const babel = require("@babel/core");

const args = minimist(process.argv.slice(2));
const envName = args.env || minimist(args._).env || "dev";
const rootPath = path.resolve(__dirname, "..");
const resolve = (filename) => path.resolve(__dirname, filename);

/**
 * Loads environment variables from .env files.
 *
 * @param {"prod" | "test" | "dev"} envName
 * @returns {{[key: string]: string}}
 */
module.exports.load = function load(envName) {
  const env = [
    dotenv.config({ path: resolve(`.env.${envName}.override`) }).parsed,
    dotenv.config({ path: resolve(`.env.${envName}`) }).parsed,
    dotenv.config({ path: resolve(`.env.override`) }).parsed,
    dotenv.config({ path: resolve(`.env`) }).parsed,
  ]
    .reverse()
    .reduce((acc, parsed) => ({ ...acc, ...parsed }), {});

  // Load Google Cloud credentials
  const gcpKey = path.resolve(__dirname, `gcp-key.${envName}.json`);

  if (fs.existsSync(gcpKey)) {
    env.GOOGLE_APPLICATION_CREDENTIALS = gcpKey;
  }

  // Resolve relative paths to absolute
  ["PGSSLCERT", "PGSSLKEY", "PGSSLROOTCERT"].forEach((key) => {
    if (env[key] && env[key].startsWith(".")) {
      env[key] = path.resolve(__dirname, env[key]);
    }
  });

  // Ensure that the SSL key file has correct permissions
  if (env.PGSSLKEY) {
    try {
      fs.chmodSync(env.PGSSLKEY, 0o600);
    } catch (err) {
      console.error(err);
    }
  }

  // Default application version
  if (!env.VERSION) {
    env.VERSION = os.userInfo().username;
  }

  // Customize @babel/register cache location
  const pkgPath = path.relative(rootPath, process.cwd());
  const cachePath = `${pkgPath}.babel.${babel.version}.${babel.getEnv()}.json`;
  env.BABEL_CACHE_PATH = path.resolve(rootPath, ".cache", cachePath);

  Object.assign(process.env, env);

  return { ...env };
};

module.exports.load(envName);
