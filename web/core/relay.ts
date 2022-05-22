/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Environment, Network, RecordSource, Store } from "relay-runtime";

type Config = {
  baseUrl?: string;
  request?: Request;
  records?: ConstructorParameters<typeof RecordSource>[0];
};

/* eslint-disable @typescript-eslint/no-explicit-any */

function createRelay(config: Config = {}): Environment {
  const recordSource = new RecordSource(config.records);
  const store = new Store(recordSource);
  const baseUrl = config.baseUrl || "";

  const network = Network.create((operation, variables): Promise<any> => {
    const cookie = config.request?.headers.get("cookie");
    const cf = (config.request as CfRequestInit | undefined)?.cf as
      | IncomingRequestCfProperties
      | undefined;

    return fetch(`${baseUrl}/api`, {
      method: "POST",
      headers: {
        ...(cookie && { cookie }),
        ...(cf?.continent && { "x-continent": cf.continent }),
        ...(cf?.country && { "x-country": cf.country }),
        ...(cf?.timezone && { "x-timezone": cf.timezone }),
        "content-Type": "application/json",
      },
      body: JSON.stringify({ query: operation.text, variables }),
      ...(!config.request && { credentials: "include" }),
    }).then((res) => res.json());
  });

  return new Environment({
    store,
    network,
    handlerProvider: null,
  });
}

function toRawId<T extends string | null | undefined>(globalId: T): T {
  return globalId && (atob(globalId).split(":")[1] as T);
}

export { createRelay, toRawId };
