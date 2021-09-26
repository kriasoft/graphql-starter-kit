/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import type { Config } from "../config";
import { local } from "../config";

export const ConfigContext = React.createContext<Config>(local);

export function useConfig(): Config {
  return React.useContext(ConfigContext);
}
