/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Close, Facebook, Google } from "@mui/icons-material";
import {
  Alert,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  Typography,
} from "@mui/material";
import * as React from "react";
import { LoginMethod, useAuth } from "../core";

type LoginButtonProps = Omit<ButtonProps, "children"> & {
  method: LoginMethod;
  icon: React.ReactNode;
};

function LoginButton(props: LoginButtonProps): JSX.Element {
  const { sx, method, icon, ...other } = props;

  return (
    <Button
      sx={{ textTransform: "none", ...sx }}
      variant="outlined"
      size="large"
      href={`/auth/${method.toLowerCase()}`}
      startIcon={icon}
      data-method={method}
      fullWidth
      {...other}
    >
      <span style={{ flexGrow: 1, textAlign: "center" }}>
        Continue with {method}
      </span>
    </Button>
  );
}

type LoginDialogProps = Omit<DialogProps, "children"> & {
  error?: string;
};

function LoginDialog(props: LoginDialogProps): JSX.Element {
  const { error, ...other } = props;
  const auth = useAuth();

  const signIn = React.useCallback(function signIn(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    const method = event.currentTarget.dataset.method as LoginMethod;
    auth.signIn({ method });
  },
  []);

  const close = React.useCallback(function close(event: React.MouseEvent) {
    event.preventDefault();
    props.onClose?.(event, "backdropClick");
  }, []);

  return (
    <Dialog scroll="body" fullScreen {...other}>
      <IconButton
        sx={{ position: "fixed", top: "8px", right: "8px" }}
        onClick={close}
        children={<Close />}
        size="large"
      />

      <DialogContent
        sx={{
          maxWidth: "320px",
          margin: "0 auto",
          "& .MuiButton-root:not(:last-of-type)": {
            marginBottom: "1rem",
          },
        }}
      >
        {/* Title */}
        <Typography
          sx={{ marginTop: "25vh", marginBottom: "1rem" }}
          variant="h3"
          align="center"
          children="Log in / Register"
        />

        {/* Error message */}
        {error && <Alert sx={{ mb: 3 }} severity="error" children={error} />}

        {/* Login buttons */}
        <LoginButton method="Google" onClick={signIn} icon={<Google />} />
        <LoginButton method="Facebook" onClick={signIn} icon={<Facebook />} />
      </DialogContent>
    </Dialog>
  );
}

export { LoginDialog };
