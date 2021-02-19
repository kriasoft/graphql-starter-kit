/**
 * Web application entry point.
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import history from "history/browser";

import { App } from "./common";

ReactDOM.render(<App history={history} />, document.getElementById("root"));
