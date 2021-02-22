/**
 * Web application entry point.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import history from "history/browser";

import { App } from "./common";
import { createRelay } from "./core/relay";

// Dehydrate the initial API response and initialize a Relay store
const data = document.getElementById("data")?.innerHTML.trim();
const records = data ? JSON.parse(data) : undefined;
const relay = createRelay({ records });

// Render the top-level React component
ReactDOM.render(
  <App history={history} relay={relay} />,
  document.getElementById("root"),
);
