/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import type { ThemeOptions } from "@material-ui/core";

/**
 * Style overrides for Material UI components.
 */
export const components: ThemeOptions["components"] = {
  // https://github.com/mui-org/material-ui/tree/next/packages/material-ui/src/Button
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
};
