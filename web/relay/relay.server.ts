/**
 * Relay configuration for the server (Node.js) environment.
 *
 * @ee https://relay.dev/docs/en/a-guided-tour-of-relay
 * @see https://relay.dev/docs/en/network-layer
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { Environment, Network, RecordSource, Store } from "relay-runtime";

export * from "./ResetRelayContext";

if (process.browser) {
  throw new Error("Not supported. See package.json->browser field.");
}

export function createRelay(): Environment {
  const source = new RecordSource();
  const store = new Store(source);
  const network = Network.create(() => {
    throw new Error("Not implemented.");
  });

  return new Environment({
    handlerProvider: null,
    network,
    store,
  });
}
