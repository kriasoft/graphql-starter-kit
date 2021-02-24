/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import { Menu, MenuProps, MenuItem, ListItemText } from "@material-ui/core";

type NotificationsMenuProps = Omit<
  MenuProps,
  | "id"
  | "role"
  | "open"
  | "getContentAnchorEl"
  | "anchorOrigin"
  | "transformOrigin"
>;

export function NotificationsMenu(props: NotificationsMenuProps): JSX.Element {
  const { PaperProps, ...other } = props;

  return (
    <Menu
      id="notifications-menu"
      role="menu"
      open={Boolean(props.anchorEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{ ...PaperProps, sx: { ...PaperProps?.sx, width: 320 } }}
      {...other}
    >
      <MenuItem>
        <ListItemText secondary="You have no notifications." />
      </MenuItem>
    </Menu>
  );
}
