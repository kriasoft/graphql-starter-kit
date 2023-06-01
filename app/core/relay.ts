/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { RelayEnvironmentProvider as Provider } from "react-relay";
import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { getIdToken } from "./auth";

/**
 * Initializes a new instance of Relay environment.
 * @see https://relay.dev/docs/
 */
export function createRelay(): Environment {
  // Configure a network layer that fetches data from the GraphQL API
  // https://relay.dev/docs/guides/network-layer/
  const network = Network.create(async function fetchFn(operation, variables) {
    const headers = new Headers({ ["Content-Type"]: "application/json" });
    const idToken = await getIdToken();

    // When the user is authenticated append the ID token to the request
    if (idToken) {
      headers.set("Authorization", `Bearer ${idToken}`);
    }

    const res = await fetch("/api", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ query: operation.text, variables }),
    });

    if (!res.ok) {
      throw new HttpError(res.status, res.statusText);
    }

    return await res.json();
  });

  // Initialize Relay records store
  const recordSource = new RecordSource();
  const store = new Store(recordSource);

  return new Environment({ store, network, handlerProvider: null });
}

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, statusText: string) {
    super(statusText);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export function toRawId<T extends string | null | undefined>(globalId: T): T {
  return globalId && (atob(globalId).split(":")[1] as T);
}

/**
 * This component makes the `relay` environment available down the React tree.
 */
export function RelayEnvironmentProvider(props: {
  children: React.ReactNode;
}): JSX.Element {
  const environment = React.useMemo(() => createRelay(), []);
  return React.createElement(Provider, { environment, ...props });
}
