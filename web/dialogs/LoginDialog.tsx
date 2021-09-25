/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Close, Facebook, Google } from "@mui/icons-material";
import {
  Alert,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import * as React from "react";
import { graphql, useRelayEnvironment } from "react-relay";
import { createOperationDescriptor, getRequest } from "relay-runtime";
import { useAuth } from "../core";

const meQuery = graphql`
  query LoginDialogMeQuery {
    me {
      ...Auth_me
    }
  }
`;

export function LoginDialog(): JSX.Element {
  const [error, setError] = React.useState<string | undefined>();
  const [state, setState] = React.useState({
    open: false,
  });
  const relay = useRelayEnvironment();
  const auth = useAuth();

  React.useEffect(() => {
    return auth.listen("signIn", () => {
      setState((prev) => (prev.open ? prev : { ...prev, open: true }));
    });
  }, []);

  const close = React.useCallback(() => {
    setState((prev) => (prev.open ? { ...prev, open: false } : prev));
  }, []);

  // Start listening for notifications from the pop-up login window
  React.useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.origin === window.location.origin &&
        event.source === loginWindow
      ) {
        if (event.data.error) {
          setError(event.data.error);
        } else if (event.data) {
          // Save user into the local store and close dialog
          const request = getRequest(meQuery);
          const operation = createOperationDescriptor(request, {});
          relay.commitPayload(operation, event.data.data);
          close();
        }
      }
    }
    window.addEventListener("message", handleMessage, false);
    return () => window.removeEventListener("message", handleMessage);
  }, [relay]);

  return (
    <Dialog open={state.open} onClose={close} scroll="body" fullScreen>
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

        {/* Error message(s) */}
        {error && <Alert sx={{ mb: 3 }} severity="error" children={error} />}

        {/* Login buttons */}
        <LoginButton provider="Google" />
        <LoginButton provider="Facebook" />
      </DialogContent>
    </Dialog>
  );
}

type LoginButtonProps = Omit<ButtonProps, "children"> & {
  provider: "Google" | "Facebook";
};

const icons = { Google: <Google />, Facebook: <Facebook /> };

// Pop-up window for Google/Facebook authentication
let loginWindow: WindowProxy | null = null;

function handleClickLogin(event: React.MouseEvent): void {
  event.preventDefault();
  const url = (event.currentTarget as HTMLAnchorElement).href;

  if (loginWindow === null || loginWindow.closed) {
    const width = 520;
    const height = 600;
    const left = window.top.outerWidth / 2 + window.top.screenX - width / 2;
    const top = window.top.outerHeight / 2 + window.top.screenY - height / 2;
    loginWindow = window.open(
      url,
      "login",
      `menubar=no,toolbar=no,status=no,width=${width},height=${height},left=${left},top=${top}`,
    );
  } else {
    loginWindow.focus();
    loginWindow.location.href = url;
  }
}

function LoginButton(props: LoginButtonProps): JSX.Element {
  const { provider, ...other } = props;
  return (
    <Button
      variant="outlined"
      size="large"
      href={`/auth/${provider.toLowerCase()}`}
      startIcon={icons[provider]}
      onClick={handleClickLogin}
      fullWidth
      {...other}
    >
      <span style={{ flexGrow: 1, textAlign: "center" }}>
        Continue with {provider}
      </span>
    </Button>
  );
}
