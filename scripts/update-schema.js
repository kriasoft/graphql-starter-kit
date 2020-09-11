/**
 * Generates `schema.graphql` file from the actual GraphQL schema.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

require("env");
require("@babel/register")({
  rootMode: "upward",
  extensions: [".ts", ".d.ts"],
  include: [],
});

const { updateSchema } = require("api/schema");

updateSchema((err) => {
  if (err) {
    console.err(err);
    process.exit(1);
  }
});
