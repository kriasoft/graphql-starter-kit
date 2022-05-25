/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Container, Link, Typography } from "@mui/material";
import * as React from "react";
import { useAuth, useNavigate } from "../core";
import { type HomeQuery$data } from "../queries/HomeQuery.graphql";

function Home(props: HomeQuery$data): JSX.Element {
  const { me } = props;
  const navigate = useNavigate();
  const auth = useAuth();

  const signIn = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    auth.signIn();
  }, []);

  return (
    <Container sx={{ my: 3 }}>
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

export default Home;
export type Home = typeof Home;
