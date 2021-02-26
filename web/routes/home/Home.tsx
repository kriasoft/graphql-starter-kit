/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import { Container, Link, Typography } from "@material-ui/core";

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
    <Container
      sx={{ marginTop: (x) => x.spacing(3), marginBottom: (x) => x.spacing(3) }}
    >
      <Typography
        sx={{ marginTop: "32vh" }}
        variant="h1"
        align="center"
        children="Welcome to React.js app!"
        gutterBottom
      />
      <Typography sx={{ fontSize: "1.125rem" }} align="center">
        {me ? (
          <React.Fragment>
            Check out your{" "}
            <Link href="/settings" onClick={navigate}>
              account settings
            </Link>
            .
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link href="/auth/google" onClick={signIn}>
              Connect
            </Link>{" "}
            via your Google account.
          </React.Fragment>
        )}
      </Typography>
    </Container>
  );
}
