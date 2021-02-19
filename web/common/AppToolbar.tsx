/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { css } from "@emotion/react";
import { useAuth, useCurrentUser, useNavigate } from "../hooks";

export type AppToolbarProps = React.ComponentProps<"div">;

export function AppToolbar(props: AppToolbarProps): JSX.Element {
  const { ...other } = props;
  const navigate = useNavigate();
  const user = useCurrentUser();
  const auth = useAuth();

  function signIn(event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    auth.signIn("google");
  }

  function signOut(event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    auth.signOut();
  }

  return (
    <div
      {...other}
      css={css`
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;

        span,
        a {
          margin-left: 0.5rem;
        }
      `}
    >
      <h1
        css={css`
          font-size: 1.5rem;
        `}
      >
        <a
          css={css`
            :hover,
            :focus,
            :active {
              text-decoration: none;
            }
          `}
          href="/"
          onClick={navigate}
        >
          App Name
        </a>
      </h1>
      <span
        css={css`
          flex-grow: 1;
        `}
      />
      {user && <span>Welcome, {user?.name}!</span>}
      {user && <a href="/" onClick={signOut} children="Sign Out" />}
      {!user && <a href="/auth/google" onClick={signIn} children="Sign In" />}
    </div>
  );
}
