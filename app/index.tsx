/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ErrorBoundary } from "./common/ErrorBoundary.js";
import { RelayEnvironmentProvider } from "./core/relay.js";
import { AppRoutes } from "./routes/index.js";
import { ThemeProvider } from "./theme/index.js";

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);

// Render the top-level React component
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ThemeProvider>
          <RelayEnvironmentProvider>
            <SnackbarProvider>
              <ErrorBoundary>
                <CssBaseline />
                <AppRoutes />
              </ErrorBoundary>
            </SnackbarProvider>
          </RelayEnvironmentProvider>
        </ThemeProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
);
