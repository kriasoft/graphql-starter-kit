/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import {
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
  Switch,
  useTheme,
} from "@material-ui/core";
import { Brightness4 } from "@material-ui/icons";

import { Logout } from "../icons";
import { useAuth } from "../hooks";

type UserMenuProps = Omit<
  MenuProps,
  | "id"
  | "role"
  | "open"
  | "getContentAnchorEl"
  | "anchorOrigin"
  | "transformOrigin"
> & {
  onChangeTheme: () => void;
};

export function UserMenu(props: UserMenuProps): JSX.Element {
  const { onChangeTheme, PaperProps, MenuListProps, ...other } = props;

  const theme = useTheme();
  const auth = useAuth();

  function signOut(event: React.MouseEvent): void {
    event.preventDefault();
    auth.signOut();
  }

  return (
    <Menu
      id="user-menu"
      role="menu"
      open={Boolean(props.anchorEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{ ...PaperProps, sx: { ...PaperProps?.sx, width: 320 } }}
      MenuListProps={{ ...MenuListProps, dense: true }}
      {...other}
    >
      <MenuItem>
        <ListItemIcon sx={{ minWidth: 40 }} children={<Brightness4 />} />
        <ListItemText primary="Dark Mode" />
        <Switch
          name="theme"
          checked={theme?.palette?.mode === "dark"}
          onChange={onChangeTheme}
        />
      </MenuItem>

      <MenuItem onClick={signOut}>
        <ListItemIcon sx={{ minWidth: 40 }} children={<Logout />} />
        <ListItemText primary="Log Out" />
      </MenuItem>

      {/* Copyright and links to legal documents */}

      <MenuItem
        dense={false}
        sx={{
          "&:hover": { background: "none" },
          "&.MuiMenuItem-dense": {
            color: (x) => x.palette.grey[500],
            paddingTop: (x) => x.spacing(0.5),
            paddingBottom: (x) => x.spacing(0.5),
            fontSize: "0.75rem",
          },
        }}
      >
        <span>&copy; 2021 Company Name</span>
        <span style={{ padding: "0 4px" }}>•</span>
        <Link sx={{ color: "inherit" }} href="/privacy">
          Privacy
        </Link>
        <span style={{ padding: "0 4px" }}>•</span>
        <Link sx={{ color: "inherit" }} href="/terms">
          Terms
        </Link>
      </MenuItem>
    </Menu>
  );
}
