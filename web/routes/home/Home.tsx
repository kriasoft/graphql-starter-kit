/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Container, Link, Typography } from "@mui/material";
import * as React from "react";
import { useAuth, useNavigate } from "../../core";
import type { homeQueryResponse as Props } from "./__generated__/homeQuery.graphql";

export default function Home(props: Props): JSX.Element {
  const { me } = props;
  const navigate = useNavigate();
  const auth = useAuth();

  const signIn = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    auth.signIn();
  }, []);

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
