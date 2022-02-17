/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { CssBaseline, PaletteMode, Toolbar } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { Action, Update } from "history";
import * as React from "react";
import { Environment, RelayEnvironmentProvider } from "react-relay";
import type { Config } from "../config";
import { AuthProvider, ConfigContext } from "../core";
import { History, HistoryContext, LocationContext } from "../core/history";
import type { RouteResponse } from "../core/router";
import { resolveRoute } from "../core/router";
import { ThemeProvider } from "../theme";
import { AppToolbar } from "./AppToolbar";
import { ErrorPage } from "./ErrorPage";

type AppProps = {
  config: Config;
  history: History;
  relay: Environment;
};

class App extends React.Component<AppProps> {
  state = {
    route: undefined as RouteResponse | undefined,
    location: this.props.history.location,
    error: undefined as Error | undefined,
    theme: (window?.localStorage?.getItem("theme") === "dark"
      ? "dark"
      : "light") as PaletteMode,
  };

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  dispose?: () => void;

  componentDidMount(): void {
    const { history } = this.props;
    this.dispose = history.listen(this.renderPath);
    this.renderPath({ location: history.location, action: Action.Pop });
  }

  componentDidUpdate(): void {
    if (this.state.route?.title) {
      self.document.title = this.state.route.title;
    }
  }

  componentWillUnmount(): void {
    if (this.dispose) this.dispose();
  }

  componentDidCatch(error: Error, errorInfo: unknown): void {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  renderPath = async (ctx: Update): Promise<void> => {
    resolveRoute({
      path: ctx.location.pathname,
      query: new URLSearchParams(ctx.location.search),
      relay: this.props.relay,
    }).then((route) => {
      if (route.error) console.error(route.error);
      this.setState({ route, location: ctx.location, error: route.error });
    });
  };

  render(): JSX.Element {
    const { config, history } = this.props;
    const { route, location, error } = this.state;

    if (error) {
      return (
        <StyledEngineProvider injectFirst>
          <ThemeProvider>
            <ErrorPage error={error} history={history} />;
          </ThemeProvider>
        </StyledEngineProvider>
      );
    }

    return (
      <ConfigContext.Provider value={config}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider>
            <RelayEnvironmentProvider environment={this.props.relay}>
              <AuthProvider>
                <HistoryContext.Provider value={history}>
                  <LocationContext.Provider value={location}>
                    <CssBaseline />
                    <AppToolbar />
                    <Toolbar />
                    {route?.component
                      ? React.createElement(route.component, route.props)
                      : null}
                  </LocationContext.Provider>
                </HistoryContext.Provider>
              </AuthProvider>
            </RelayEnvironmentProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ConfigContext.Provider>
    );
  }
}

export { App };
