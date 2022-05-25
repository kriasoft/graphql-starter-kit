/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Brightness4, Settings } from "@mui/icons-material";
import {
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
  Switch,
} from "@mui/material";
import * as React from "react";
import { useAuth, useNavigate, useTheme } from "../core";
import { Logout } from "../icons";

type UserMenuProps = Omit<
  MenuProps,
  | "id"
  | "role"
  | "open"
  | "getContentAnchorEl"
  | "anchorOrigin"
  | "transformOrigin"
>;

function UserMenu(props: UserMenuProps): JSX.Element {
  const { PaperProps, MenuListProps, ...other } = props;

  const [theme, toggleTheme] = useTheme();
  const navigate = useNavigate();
  const auth = useAuth();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>): void {
    props.onClose?.(event, "backdropClick");
    navigate(event);
  }

  return (
    <Menu
      id="user-menu"
      role="menu"
      open={Boolean(props.anchorEl)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{ ...PaperProps, sx: { ...PaperProps?.sx, width: 320 } }}
      MenuListProps={{ ...MenuListProps, dense: true }}
      {...other}
    >
      <MenuItem component={Link} href="/settings" onClick={handleClick}>
        <ListItemIcon sx={{ minWidth: 40 }} children={<Settings />} />
        <ListItemText primary="Account Settings" />
      </MenuItem>

      <MenuItem>
        <ListItemIcon sx={{ minWidth: 40 }} children={<Brightness4 />} />
        <ListItemText primary="Dark Mode" />
        <Switch
          name="theme"
          checked={theme?.palette?.mode === "dark"}
          onChange={toggleTheme}
        />
      </MenuItem>

      <MenuItem onClick={auth.signOut}>
        <ListItemIcon sx={{ minWidth: 40 }} children={<Logout />} />
        <ListItemText primary="Log Out" />
      </MenuItem>

      {/* Copyright and links to legal documents */}

      <MenuItem
        sx={{
          "&:hover": { background: "none" },
          color: (x) => x.palette.grey[500],
          py: 0.5,
          fontSize: "0.75rem",
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

export { UserMenu, type UserMenuProps };
