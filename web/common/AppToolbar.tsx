/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import {
  AppBar,
  AppBarProps,
  Avatar,
  Button,
  Chip,
  Link,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core";
import { ArrowDropDown, NotificationsNone } from "@material-ui/icons";

import { useAuth, useCurrentUser, useNavigate } from "../hooks";
import { UserMenu, NotificationsMenu } from "../menu";

export type AppToolbarProps = AppBarProps;

export function AppToolbar(props: AppToolbarProps): JSX.Element {
  const { ...other } = props;
  const menuAnchorRef = React.createRef<HTMLButtonElement>();

  const [anchorEl, setAnchorEl] = React.useState({
    userMenu: null as HTMLElement | null,
    notifications: null as HTMLElement | null,
  });

  const navigate = useNavigate();
  const user = useCurrentUser();
  const auth = useAuth();

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

  function signIn(event: React.MouseEvent): void {
    event.preventDefault();
    auth.signIn("google");
  }

  return (
    <AppBar color="default" {...other}>
      <Toolbar>
        {/* App Logo */}

        <Typography variant="h1" sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
          <Link color="inherit" underline="none" href="/" onClick={navigate}>
            App Name
          </Link>
        </Typography>

        <span style={{ flexGrow: 1 }} />

        {/* Account related controls (icon buttons) */}

        {user && (
          <Chip
            sx={{
              height: 40,
              borderRadius: 20,
              fontWeight: 600,
              backgroundColor: (x) => x.palette.grey[300],
              ".MuiChip-avatar": { width: 32, height: 32 },
            }}
            component="a"
            avatar={
              <Avatar alt={user.name || ""} src={user.picture || undefined} />
            }
            label={getFirstName(user.name || "")}
            href="/"
            onClick={navigate}
          />
        )}
        {user && (
          <IconButton
            sx={{
              marginLeft: (x) => x.spacing(1),
              backgroundColor: (x) => x.palette.grey[300],
              width: 40,
              height: 40,
            }}
            children={<NotificationsNone />}
            onClick={openNotificationsMenu}
          />
        )}
        {user && (
          <IconButton
            ref={menuAnchorRef}
            sx={{
              marginLeft: (x) => x.spacing(1),
              backgroundColor: (x) => x.palette.grey[300],
              width: 40,
              height: 40,
            }}
            children={<ArrowDropDown />}
            onClick={openUserMenu}
          />
        )}
        {!user && (
          <Button
            href="/auth/google"
            color="inherit"
            onClick={signIn}
            children="Sign In"
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
