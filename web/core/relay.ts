/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { Environment, Network, RecordSource, Store } from "relay-runtime";

type Config = {
  baseUrl?: string;
  request?: Request;
  records?: ConstructorParameters<typeof RecordSource>[0];
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export function createRelay(config: Config = {}): Environment {
  const recordSource = new RecordSource(config.records);
  const store = new Store(recordSource);
  const baseUrl = config.baseUrl || "";

  const network = Network.create(
    (operation, variables): Promise<any> =>
      fetch(`${baseUrl}/graphql`, {
        method: "POST",
        headers: {
          // Pass-through headers from the original HTTP request
          // when used in Cloudflare Workers environment. See `proxy/index.ts`.
          ...(config.request &&
            (Array.from(config.request.headers).reduce(
              (acc, [k, v]) => ({ ...acc, [k]: v }),
              {},
            ) as { [key: string]: string })),

          "Content-Type": "application/json",
        },
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
