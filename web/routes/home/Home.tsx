/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import { Container, Link, Typography } from "@material-ui/core";
import * as React from "react";
import { useLoginDialog, useNavigate } from "../../hooks";
import type { homeQueryResponse as Props } from "./__generated__/homeQuery.graphql";

export default function Home(props: Props): JSX.Element {
  const { me } = props;
  const loginDialog = useLoginDialog();
  const navigate = useNavigate();

  function signIn(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    loginDialog.show();
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
            via your Google or Facebook account.
          </React.Fragment>
        )}
      </Typography>
    </Container>
  );
}
