/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import type { ThemeOptions } from "@mui/material/styles";

/**
 * Style overrides for Material UI components.
 *
 * @see https://github.com/mui-org/material-ui/tree/master/packages/mui-material/src
 */
export const components: ThemeOptions["components"] = {
  MuiLink: {
    defaultProps: {
      underline: "none",
      onClick(event: React.MouseEvent<HTMLAnchorElement>) {
        const { target } = event.currentTarget;
        if (
          !event.defaultPrevented && // onClick prevented default
          event.button === 0 && // ignore everything but left clicks
          (!target || target === "_self") && // let browser handle "target=_blank" etc.
          !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
          event.preventDefault();
          import("history/browser").then((x) =>
            x.default.push(event.currentTarget.href),
          );
        }
      },
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
};

function isModifiedEvent(event: React.MouseEvent) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
