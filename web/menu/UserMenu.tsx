/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import {
  Menu,
  MenuProps,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

import { Logout } from "../icons";
import { useAuth } from "../hooks";

export type UserMenuProps = Omit<
  MenuProps,
  | "id"
  | "role"
  | "open"
  | "getContentAnchorEl"
  | "anchorOrigin"
  | "transformOrigin"
>;

export function UserMenu(props: UserMenuProps): JSX.Element {
  const { MenuListProps, ...other } = props;
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
      MenuListProps={{ ...MenuListProps, dense: true }}
      {...other}
    >
      <MenuItem onClick={signOut} dense>
        <ListItemIcon children={<Logout />} />
        <ListItemText primary="Log Out" />
      </MenuItem>
    </Menu>
  );
}
