/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { type ThemeOptions } from "@mui/material/styles";

type Func = () => NonNullable<ThemeOptions["typography"]>;

/**
 * Customized Material UI typography.
 *
 * @see https://mui.com/customization/typography/
 * @see https://mui.com/customization/default-theme/?expand-path=$.typography
 */
const createTypography: Func = () => ({
  fontFamily: [
    `system-ui`,
    `-apple-system`,
    `BlinkMacSystemFont`,
    `'Segoe UI'`,
    `Helvetica`,
    `Arial`,
    `sans-serif`,
    `'Apple Color Emoji'`,
    `'Segoe UI Emoji'`,
    `'Segoe UI Symbol'`,
  ].join(","),
  h1: {
    fontSize: "2.5rem",
  },
  h2: {
    fontSize: "2rem",
  },
  h3: {
    fontSize: "1.75rem",
  },
  h4: {
    fontSize: "1.5rem",
  },
  h5: {
    fontSize: "1.25rem",
  },
  h6: {
    fontSize: "1rem",
  },
});

export { createTypography };
