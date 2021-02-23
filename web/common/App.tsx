/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { Update, Action } from "history";
import { Environment } from "relay-runtime";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import {
  CssBaseline,
  Container,
  Toolbar,
  ThemeProvider,
} from "@material-ui/core";

import theme from "../theme";
import { ErrorPage } from "./ErrorPage";
import { AppToolbar } from "./AppToolbar";
import { resolveRoute } from "../core/router";
import { History, HistoryContext, LocationContext } from "../core/history";
import type { RouteResponse } from "../core/router";

export type AppProps = {
  history: History;
  relay: Environment;
};

export class App extends React.Component<AppProps> {
  state = {
    route: undefined as RouteResponse | undefined,
    location: this.props.history.location,
    error: undefined as Error | undefined,
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

  render(): JSX.Element {
    const { history } = this.props;
    const { route, location, error } = this.state;

    if (error) {
      return <ErrorPage error={error} />;
    }

    return (
      <ThemeProvider theme={theme}>
        <RelayEnvironmentProvider environment={this.props.relay}>
          <HistoryContext.Provider value={history}>
            <LocationContext.Provider value={location}>
              <CssBaseline />
              <AppToolbar />
              <Toolbar />
              <Container
                maxWidth="md"
                sx={{
                  marginTop: (x) => x.spacing(4),
                  marginBottom: (x) => x.spacing(4),
                }}
              >
                {route?.component
                  ? React.createElement(route.component, route.props)
                  : null}
              </Container>
            </LocationContext.Provider>
          </HistoryContext.Provider>
        </RelayEnvironmentProvider>
      </ThemeProvider>
    );
  }
}
