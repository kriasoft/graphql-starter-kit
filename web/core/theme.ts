/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type Theme } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import * as React from "react";
import { ToggleThemeContext } from "../theme";

function useTheme(): [Theme, () => void] {
  return [useMuiTheme(), React.useContext(ToggleThemeContext)];
}

export { useTheme };
