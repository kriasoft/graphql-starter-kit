/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { css } from "@emotion/react";

export type AppContentProps = React.ComponentProps<"div">;

export function AppContent(props: AppContentProps): JSX.Element {
  const { ...other } = props;

  return (
    <div
      {...other}
      css={css`
        max-width: 640px;
        margin: 0 auto;
        padding: 1 rem;
      `}
    />
  );
}
