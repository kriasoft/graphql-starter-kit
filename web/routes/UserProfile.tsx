/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import {
  Avatar,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { type UserProfileQuery$data } from "../queries/UserProfileQuery.graphql";

function UserProfile(props: UserProfileQuery$data): JSX.Element {
  const { user } = props;

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "grid",
        gridGap: 24,
        gridTemplateColumns: "160px auto",
        my: 3,
      }}
    >
      {/* User summary: name, avatar, etc. */}

      <aside>
        <Avatar
          sx={{ width: 160, height: 160, mb: 2 }}
          alt={user?.name || ""}
          src={user?.picture?.url || undefined}
        />
        <Typography
          sx={{ fontSize: "1.125rem" }}
          variant="h3"
          children={user?.name}
          gutterBottom
        />
        <Typography
          sx={{ mb: 2 }}
          variant="h4"
          color="textSecondary"
          children={`u/${user?.username}`}
          gutterBottom
        />

        <Button size="small" variant="outlined" fullWidth>
          Follow
        </Button>
      </aside>

      {/* User activity, etc. */}

      <div>
        <Card sx={{ mb: 2 }}>
          <CardContent>...</CardContent>
        </Card>

        <Card sx={{ minHeight: 600 }}>
          <CardContent>...</CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default UserProfile;
export type UserProfile = typeof UserProfile;
