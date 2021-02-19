/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { Environment, Network, RecordSource, Store } from "relay-runtime";

type Config = {
  baseUrl?: string;
  request?: Request;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export function createRelay(config: Config = {}): Environment {
  const recordSource = new RecordSource();
  const store = new Store(recordSource);
  const baseUrl = config.baseUrl || "";

  const network = Network.create(
    (operation, variables): Promise<any> =>
      fetch(new Request(`${baseUrl}/graphql`, config.request), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: operation.text, variables }),
        ...(!config.request && { credentials: "include" }),
      }).then((res) => res.json()),
  );

  return new Environment({
    store,
    network,
    handlerProvider: null,
  });
}
