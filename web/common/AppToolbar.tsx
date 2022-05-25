/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { ArrowDropDown, NotificationsNone } from "@mui/icons-material";
import {
  AppBar,
  AppBarProps,
  Avatar,
  Button,
  Chip,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useAuth, useNavigate } from "../core";
import { NotificationsMenu, UserMenu } from "../menus";

type AppToolbarProps = Omit<AppBarProps, "children">;

function AppToolbar(props: AppToolbarProps): JSX.Element {
  const menuAnchorRef = React.createRef<HTMLButtonElement>();
  const { me, signIn } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState({
    userMenu: null as HTMLElement | null,
    notifications: null as HTMLElement | null,
  });

  function openNotificationsMenu() {
    setAnchorEl((x) => ({ ...x, notifications: menuAnchorRef.current }));
  }

  function closeNotificationsMenu() {
    setAnchorEl((x) => ({ ...x, notifications: null }));
  }

  function openUserMenu() {
    setAnchorEl((x) => ({ ...x, userMenu: menuAnchorRef.current }));
  }

  function closeUserMenu() {
    setAnchorEl((x) => ({ ...x, userMenu: null }));
  }

  function handleSignIn(event: React.MouseEvent): void {
    event.preventDefault();
    signIn();
  }

  return (
    <AppBar color="default" {...props}>
      <Toolbar>
        {/* App Logo */}

        <Typography variant="h1" sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
          <Link color="inherit" underline="none" href="/" onClick={navigate}>
            App Name
          </Link>
        </Typography>

        <span style={{ flexGrow: 1 }} />

        {/* Account related controls (icon buttons) */}

        {me && (
          <Chip
            sx={{
              height: 40,
              borderRadius: 20,
              fontWeight: 600,
              backgroundColor: (x) =>
                x.palette.mode === "light"
                  ? x.palette.grey[300]
                  : x.palette.grey[700],
              ".MuiChip-avatar": { width: 32, height: 32 },
            }}
            component="a"
            avatar={
              <Avatar alt={me.name || ""} src={me.picture.url || undefined} />
            }
            label={getFirstName(me.name || "")}
            href={`/u/${me.username}`}
            onClick={navigate}
          />
        )}
        {me && (
          <IconButton
            sx={{
              ml: 1,
              backgroundColor: (x) =>
                x.palette.mode === "light"
                  ? x.palette.grey[300]
                  : x.palette.grey[700],
              width: 40,
              height: 40,
            }}
            children={<NotificationsNone />}
            onClick={openNotificationsMenu}
            size="large"
          />
        )}
        {me && (
          <IconButton
            ref={menuAnchorRef}
            sx={{
              ml: 1,
              backgroundColor: (x) =>
                x.palette.mode === "light"
                  ? x.palette.grey[300]
                  : x.palette.grey[700],
              width: 40,
              height: 40,
            }}
            children={<ArrowDropDown />}
            onClick={openUserMenu}
            size="large"
          />
        )}
        {!me && (
          <Button
            sx={{ textTransform: "none" }}
            variant="outlined"
            href="/auth/google"
            color="primary"
            onClick={handleSignIn}
            children="Log In / Sign Up"
          />
        )}
      </Toolbar>

      {/* Pop-up menus */}

      <NotificationsMenu
        anchorEl={anchorEl.notifications}
        onClose={closeNotificationsMenu}
        PaperProps={{ sx: { marginTop: "8px" } }}
      />
      <UserMenu
        anchorEl={anchorEl.userMenu}
        onClose={closeUserMenu}
        PaperProps={{ sx: { marginTop: "8px" } }}
      />
    </AppBar>
  );
}

function getFirstName(displayName: string): string {
  return displayName && displayName.split(" ")[0];
}

export { AppToolbar };
