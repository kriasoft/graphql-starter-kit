/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { css, Global } from "@emotion/react";

/**
 * Global application styles.
 */
export function AppStyles(): JSX.Element {
  return (
    <Global
      styles={css`
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        a {
          color: #0070f3;
          text-decoration: none;
        }

        a:hover,
        a:focus,
        a:active {
          text-decoration: underline;
        }

        * {
          box-sizing: border-box;
        }
      `}
    />
  );
}
