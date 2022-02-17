/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type PaletteMode } from "@mui/material";
import { type ThemeOptions } from "@mui/material/styles";

type Func = (mode: PaletteMode) => NonNullable<ThemeOptions["components"]>;

/**
 * Style overrides for Material UI components.
 *
 * @see https://github.com/mui-org/material-ui/tree/master/packages/mui-material/src
 */
const createComponents: Func = () => ({
  MuiLink: {
    defaultProps: {
      underline: "none",
      onClick: handleClick,
    },
  },

  MuiTextField: {
    defaultProps: {
      InputLabelProps: { shrink: true },
    },
  },

  MuiButton: {
    styleOverrides: {
      contained: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
      },
    },
  },

  MuiButtonGroup: {
    styleOverrides: {
      root: {
        boxShadow: "none",
      },
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: "1.125rem",
      },
    },
  },
});

function isModifiedEvent(event: React.MouseEvent): boolean {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function handleClick(event: React.MouseEvent<HTMLAnchorElement>): void {
  const { target } = event.currentTarget;
  if (
    !event.defaultPrevented && // onClick prevented default
    event.button === 0 && // ignore everything but left clicks
    (!target || target === "_self") && // let browser handle "target=_blank" etc.
    !isModifiedEvent(event) // ignore clicks with modifier keys
  ) {
    event.preventDefault();
    const { href } = event.currentTarget;
    import("history/browser").then((x) => x.default.push(href));
  }
}

export { createComponents };
