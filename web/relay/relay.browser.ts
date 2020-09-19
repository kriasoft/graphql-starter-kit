/**
 * Relay configuration for the browser environment.
 *
 * @ee https://relay.dev/docs/en/a-guided-tour-of-relay
 * @see https://relay.dev/docs/en/network-layer
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import {
  Environment,
  Network,
  QueryResponseCache,
  RecordSource,
  Store,
} from "relay-runtime";
import type { GraphQLResponseWithData } from "relay-runtime";

export * from "./ResetRelayContext";

if (!process.browser) {
  throw new Error("Not supported. See package.json->browser field.");
}

const oneMinute = 60 * 1000;
const cache = new QueryResponseCache({ size: 250, ttl: oneMinute });

export function createRelay(): Environment {
  const source = new RecordSource();
  const store = new Store(source);

  const network = Network.create((operation, variables, cacheConfig) => {
    const queryID = operation.text;
    const isMutation = operation.operationKind === "mutation";
    const isQuery = operation.operationKind === "query";
    const forceFetch = cacheConfig?.force;

    // Try to get data from cache on queries
    const fromCache = queryID && cache.get(queryID, variables);
    if (isQuery && fromCache !== null && !forceFetch) {
      return fromCache as GraphQLResponseWithData;
    }

    // Otherwise, fetch data from server
    return fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        // Update cache on queries
        if (isQuery && queryID && json) {
          cache.set(queryID, variables, json);
        }
        // Clear cache on mutations
        if (isMutation) {
          cache.clear();
        }

        return json;
      });
  });

  return new Environment({
    handlerProvider: null,
    network,
    store,
  });
}
