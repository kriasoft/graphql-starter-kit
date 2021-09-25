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
import * as React from "react";
import type { Input } from "./Settings.hooks";
import { useState } from "./Settings.hooks";

const fields: { key: keyof Input; label: string }[] = [
  { key: "name", label: "Display Name" },
  { key: "email", label: "Email" },
  { key: "username", label: "Username" },
];

export default function Settings(): JSX.Element {
  const { input, errors, loading, handleChange, handleSubmit } = useState();

  return (
    <Container
      maxWidth="sm"
      sx={{ marginTop: (x) => x.spacing(3), marginBottom: (x) => x.spacing(3) }}
    >
      <Typography
        sx={{ marginBottom: (theme) => theme.spacing(2) }}
        variant="h2"
        children="Account Settings"
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
            key={x.key}
            name={x.key}
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
