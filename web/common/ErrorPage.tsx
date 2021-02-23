/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { CssBaseline, Container, Typography } from "@material-ui/core";

export type ErrorPageProps = {
  error: Error;
};

export function ErrorPage(props: ErrorPageProps): JSX.Element {
  const { error } = props;

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography
          variant="h1"
          align="center"
          sx={{
            padding: (theme) => theme.spacing(2),
            marginTop: "43vh",
            fontSize: "2em",
            fontWeight: 300,
            "& strong": {
              fontWeight: 400,
            },
          }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <strong>Error {(error as any).status || 500}</strong>: {error.message}
        </Typography>
      </Container>
    </React.Fragment>
  );
}
