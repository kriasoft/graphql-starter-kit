/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type Input } from "./AccountSettings.hooks";

const fields: { key: keyof Input; label: string }[] = [
  { key: "name", label: "Display Name" },
  { key: "email", label: "Email" },
  { key: "username", label: "Username" },
];

function AccountSettings(): JSX.Element {
  const { input, errors, loading, handleChange, handleSubmit } = useState();

  return (
    <Container
      maxWidth="sm"
      sx={{ marginTop: (x) => x.spacing(3), marginBottom: (x) => x.spacing(3) }}
    >
      <Typography
        sx={{ marginBottom: (theme) => theme.spacing(2) }}
        variant="h2"
        children="Account AccountSettings"
      />

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
        onSubmit={handleSubmit}
      >
        {errors._ && (
          <Alert
            sx={{ mb: 3, alignSelf: "stretch" }}
            severity="error"
            children={errors._.join(", ")}
          />
        )}

        {fields.map((x) => (
          <TextField
            sx={{ marginBottom: (theme) => theme.spacing(2) }}
            key={x.key as string}
            name={x.key as string}
            type={x.key === "email" ? "email" : "text"}
            label={x.label}
            value={input[x.key]}
            error={Boolean(errors[x.key])}
            helperText={errors[x.key]?.join(" ")}
            onChange={handleChange}
            disabled={loading}
            fullWidth
          />
        ))}

        <Button variant="contained" type="submit" children="Save" />
      </Box>
    </Container>
  );
}

export default AccountSettings;
export type AccountSettings = typeof AccountSettings;
