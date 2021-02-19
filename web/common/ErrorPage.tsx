/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { css } from "@emotion/react";

import { AppStyles } from "./AppStyles";

export type ErrorPageProps = {
  error: Error;
};

export function ErrorPage(props: ErrorPageProps): JSX.Element {
  const { error } = props;

  return (
    <React.Fragment>
      <AppStyles />
      <p
        css={css`
          max-width: 600px;
          padding: 16px;
          margin: 43vh auto 0;
          text-align: center;
          font-size: 2rem;
          font-weight: 300;
        `}
      >
        <strong
          css={css`
            font-weight: 500;
          `}
        >
          Error {error.status || 500}
        </strong>
        : {error.message}
      </p>
    </React.Fragment>
  );
}
