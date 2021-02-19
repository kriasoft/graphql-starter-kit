/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { css } from "@emotion/react";
import type { homeQueryResponse as Props } from "./__generated__/homeQuery.graphql";
import { useNavigate, useAuth } from "../../hooks";

export default function Home(props: Props): JSX.Element {
  const { me } = props;
  const navigate = useNavigate();
  const auth = useAuth();

  function signIn(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    auth.signIn("google");
  }

  return (
    <React.Fragment>
      <h1
        css={css`
          text-align: center;
          margin-top: 35vh;
        `}
        children="Welcome to React.js app!"
      />
      <p
        css={css`
          text-align: center;
          font-size: 1.125rem;
        `}
      >
        {me ? (
          <React.Fragment>
            Check out your{" "}
            <a href="/settings" onClick={navigate}>
              account settings
            </a>
            .
          </React.Fragment>
        ) : (
          <React.Fragment>
            <a href="/auth/google" onClick={signIn}>
              Connect
            </a>{" "}
            via your Google account.
          </React.Fragment>
        )}
      </p>
    </React.Fragment>
  );
}
