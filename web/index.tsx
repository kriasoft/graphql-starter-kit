/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import history from "history/browser";
import * as React from "react";
import { createRoot } from "react-dom/client";
import type { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { App } from "./common";
import type { Config } from "./config";
import { createRelay } from "./core";

// Parses out the initial application state (config, Relay store)
// injected into HTML markup (see `public/index.html`)
// https://developer.mozilla.org/docs/Web/HTML/Element/script#embedding_data_in_html
function load<T = unknown>(elementId: string): T {
  const el = document.getElementById(elementId) as HTMLScriptElement;
  return el.text ? JSON.parse(el.text) : undefined;
}

const root = createRoot(document.getElementById("root") as HTMLElement);
const data = load<RecordMap>("data");
const config = load<Config>("config");
const relay = createRelay({ records: data });

// Render the top-level React component
root.render(<App config={config} history={history} relay={relay} />);
