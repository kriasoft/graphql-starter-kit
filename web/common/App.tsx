/**
 * @copyright 2016-present Kriasoft (https://git.io/Jt7GM)
 */

import * as React from "react";
import { Update, Action } from "history";
import { Environment } from "relay-runtime";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  Toolbar,
} from "@material-ui/core";

import theme from "../theme";
import { ErrorPage } from "./ErrorPage";
import { AppToolbar } from "./AppToolbar";
import { resolveRoute } from "../core/router";
import { History, HistoryContext, LocationContext } from "../core/history";
import type { RouteResponse } from "../core/router";

type AppProps = {
  history: History;
  relay: Environment;
};

export class App extends React.Component<AppProps> {
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
      relay: this.props.relay,
    }).then((route) => {
      if (route.error) console.error(route.error);
      this.setState({ route, location: ctx.location, error: route.error });
    });
  };

  handleChangeTheme = (): void => {
    this.setState((x: { theme: PaletteMode }) => {
      const theme = x.theme === "light" ? "dark" : "light";
      window.localStorage?.setItem("theme", theme);
      return { ...x, theme };
    });
  };

  render(): JSX.Element {
    const { history } = this.props;
    const { route, location, error } = this.state;

    if (error) {
      return (
        <ThemeProvider theme={theme[this.state.theme]}>
          <ErrorPage error={error} history={history} />;
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme[this.state.theme]}>
        <RelayEnvironmentProvider environment={this.props.relay}>
          <HistoryContext.Provider value={history}>
            <LocationContext.Provider value={location}>
              <CssBaseline />
              <AppToolbar onChangeTheme={this.handleChangeTheme} />
              <Toolbar />
              {route?.component
                ? React.createElement(route.component, route.props)
                : null}
            </LocationContext.Provider>
          </HistoryContext.Provider>
        </RelayEnvironmentProvider>
      </ThemeProvider>
    );
  }
}
