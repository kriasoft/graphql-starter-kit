/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { local, type Config } from "../config";

const ConfigContext = React.createContext<Config>(local);

function useConfig(): Config {
  return React.useContext(ConfigContext);
}

export { useConfig, ConfigContext };
