/**
 * Relay configuration
 *
 * @see https://relay.dev/docs/installation-and-setup
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

module.exports = {
  src: ".",
  schema: "../api/schema.graphql",
  language: require("relay-compiler-language-typescript"),
  watchman: false,
};
