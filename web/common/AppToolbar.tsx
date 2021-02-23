/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import { css } from "@emotion/react";
import {
  AppBar,
  AppBarProps,
  Avatar,
  Button,
  Chip,
  Link,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";

import { useAuth, useCurrentUser, useNavigate } from "../hooks";
import { UserMenu } from "../menu";

export type AppToolbarProps = AppBarProps;

export function AppToolbar(props: AppToolbarProps): JSX.Element {
  const { ...other } = props;
  const [userMenuEl, setUserMenuEl] = React.useState<HTMLElement | undefined>();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const auth = useAuth();

  function openUserMenu(event: React.MouseEvent<HTMLElement>) {
    setUserMenuEl(event.currentTarget);
  }

  function closeUserMenu() {
    setUserMenuEl(undefined);
  }

  function signIn(event: React.MouseEvent): void {
    event.preventDefault();
    auth.signIn("google");
  }

  return (
    <AppBar color="default" {...other}>
      <Toolbar>
        <Typography
          variant="h1"
          css={css`
            font-size: 1.5rem;
            font-weight: 500;
          `}
        >
          <Link color="inherit" underline="none" href="/" onClick={navigate}>
            App Name
          </Link>
        </Typography>
        <span
          css={css`
            flex-grow: 1;
          `}
        />
        {user && (
          <Chip
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
          <Chip
            sx={{
              marginLeft: (x) => x.spacing(1),
              "& .MuiChip-label": {
                paddingRight: 0,
              },
            }}
            onDelete={openUserMenu}
            deleteIcon={<ArrowDropDown />}
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
      <UserMenu
        anchorEl={userMenuEl}
        onClose={closeUserMenu}
        PaperProps={{ sx: { marginTop: "21px" } }}
      />
    </AppBar>
  );
}

function getFirstName(name: string): string {
  return name && name.split(" ")[0];
}
