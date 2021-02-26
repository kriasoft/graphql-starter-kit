/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";

import type { userProfileQueryResponse as Props } from "./__generated__/userProfileQuery.graphql";

export default function UserProfile(props: Props): JSX.Element {
  const { user } = props;

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "grid",
        gridGap: 24,
        gridTemplateColumns: "160px auto",
        marginTop: (x) => x.spacing(3),
        marginBottom: (x) => x.spacing(3),
      }}
    >
      {/* User summary: name, avatar, etc. */}

      <aside>
        <Avatar
          sx={{ width: 160, height: 160, marginBottom: (x) => x.spacing(2) }}
          alt={user?.name || ""}
          src={user?.picture || undefined}
        />
        <Typography
          sx={{ fontSize: "1.125rem" }}
          variant="h3"
          children={user?.name}
          gutterBottom
        />
        <Typography
          sx={{ marginBottom: (x) => x.spacing(2) }}
          variant="h4"
          color="textSecondary"
          children={`@${user?.username}`}
          gutterBottom
        />

        <Button size="small" variant="outlined" fullWidth>
          Follow
        </Button>
      </aside>

      {/* User activity, etc. */}

      <div>
        <Card sx={{ marginBottom: (x) => x.spacing(2) }}>
          <CardContent>...</CardContent>
        </Card>

        <Card sx={{ minHeight: 600 }}>
          <CardContent>...</CardContent>
        </Card>
      </div>
    </Container>
  );
}
