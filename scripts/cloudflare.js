/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

const path = require("path");
const assert = require("assert");
const envars = require("envars");
const minimist = require("minimist");
const { default: got } = require("got");

/**
 * Cloudflare API client.
 *
 * @example
 *   $ yarn cf:create-test-subdomain --version #0
 *   $ yarn cf:delete-test-subdomain --version #0
 *
 * @type {import("got").Got}
 */
const cf = got.extend({
  prefixUrl: `https://api.cloudflare.com/client/v4`,
  responseType: "json",
  resolveBodyOnly: true,
  hooks: {
    beforeRequest: [
      (options) => {
        options.headers.authorization = `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`;
      },
    ],
    afterResponse: [
      (res) => {
        if (!res.body?.success) throw new Error(res.body.errors[0].message);
        res.body?.messages.forEach((x) => console.log(x));
        res.body = res.body.result || res.body;
        return res;
      },
    ],
  },
});

/**
 * Creates or updates a temporary test subdomain in Cloudflare.
 *
 * @param {number | string} version
 * @param {string | undefined} content
 */
async function createTestSubdomain(version, content = "192.0.2.1") {
  const { APP_ORIGIN, CLOUDFLARE_ZONE_ID } = process.env;
  const name = `${version}-${new URL(APP_ORIGIN).hostname}`;
  const record = { type: "A", name, content, ttl: 1, proxied: true };

  // Check if the target subdomain already exists
  const records = await cf.get(
    `zones/${CLOUDFLARE_ZONE_ID}/dns_records?type=${record.type}&name=${record.name}`,
  );

  // Create or update the target subdomain
  if (records.length === 0) {
    console.log(`Creating ${name} subdomain...`);
    await cf.post(`zones/${CLOUDFLARE_ZONE_ID}/dns_records`, {
      json: record,
    });
  } else {
    console.log(`Updating ${name} subdomain...`);
    await Promise.all(
      records.map(({ id }) =>
        cf.patch(`zones/${CLOUDFLARE_ZONE_ID}/dns_records/${id}`, {
          json: record,
        }),
      ),
    );
  }
}

/**
 * Deletes a temporary subdomain from Cloudflare.
 *
 * @param {number | string} version
 */
async function deleteTestSubdomain(version) {
  const { APP_ORIGIN, CLOUDFLARE_ZONE_ID } = process.env;
  const name = `${version}-${new URL(APP_ORIGIN).hostname}`;
  const records = await cf.get(
    `zones/${CLOUDFLARE_ZONE_ID}/dns_records?type=A&name=${name}`,
  );
  return Promise.all(
    records.map((record) =>
      cf.delete(`zones/${CLOUDFLARE_ZONE_ID}/dns_records/${record.id}`),
    ),
  );
}

// Execute one of the commands when the script is launched directly
if (require.main.filename === __filename) {
  // Load environment variables (CLOUDFLARE_ACCOUNT_ID, etc.)
  const args = minimist(process.argv.slice(2));
  envars.config({
    env: args.env || "test",
    cwd: path.resolve(__dirname, "../env"),
  });

  let cmd;

  switch (args._[0]) {
    case "create-test-subdomain":
      assert(args.version, "Missing --version argument");
      cmd = createTestSubdomain(args.version);
      break;
    case "delete-test-subdomain":
      assert(args.version, "Missing --version argument");
      cmd = deleteTestSubdomain(args.version);
      break;
    default:
      cmd = Promise.reject(`Unknown command name: ${args._[0]}`);
  }

  cmd.catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { cf, createTestSubdomain, deleteTestSubdomain };
