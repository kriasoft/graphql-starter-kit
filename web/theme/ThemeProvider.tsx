/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type PaletteMode, type Theme } from "@mui/material";
import {
  createTheme as createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import * as React from "react";
import { createComponents } from "./components";
import { createPalette } from "./palette";
import { createTypography } from "./typography";

type ThemeProviderProps = {
  children: React.ReactNode;
};

/**
 * Creates a customized version of Material UI theme.
 *
 * @see https://mui.com/customization/theming/
 * @see https://mui.com/customization/default-theme/
 */
function createTheme(mode: PaletteMode): Theme {
  return createMuiTheme({
    palette: createPalette(mode),
    components: createComponents(mode),
    typography: createTypography(),
  });
}

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
const ToggleThemeContext = React.createContext(() => {});

function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = React.useState(() => createTheme("light"));

  const toggleTheme = React.useCallback(() => {
    setTheme((theme) =>
      createTheme(theme.palette.mode === "light" ? "dark" : "light"),
    );
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <ToggleThemeContext.Provider value={toggleTheme}>
        {props.children}
      </ToggleThemeContext.Provider>
    </MuiThemeProvider>
  );
}

export { ThemeProvider, ToggleThemeContext };
