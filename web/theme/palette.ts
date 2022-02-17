/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type PaletteMode } from "@mui/material";
import { type PaletteOptions } from "@mui/material/styles";

/**
 * Customized Material UI color palette.
 *
 * @see https://mui.com/customization/palette/
 * @see https://mui.com/customization/default-theme/?expand-path=$.palette
 */
const createPalette = (mode: PaletteMode): PaletteOptions => ({
  mode,
  background: {
    default: mode === "light" ? "rgba(242,246,252,1)" : "#121212",
  },
});

export { createPalette };
