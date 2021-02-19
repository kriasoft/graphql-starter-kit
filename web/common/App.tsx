/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { Update, Action } from "history";
import { RelayEnvironmentProvider } from "react-relay/hooks";

import { ErrorPage } from "./ErrorPage";
import { AppStyles } from "./AppStyles";
import { AppToolbar } from "./AppToolbar";
import { AppContent } from "./AppContent";
import { createRelay } from "../core/relay";
import { resolveRoute } from "../core/router";
import { History, HistoryContext, LocationContext } from "../core/history";
import type { RouteResponse } from "../core/router";

export type AppProps = {
  history: History;
};

export class App extends React.Component<AppProps> {
  state = {
    relay: createRelay(),
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
      relay: this.state.relay,
    }).then((route) => {
      if (route.error) console.error(route.error);
      this.setState({ route, location: ctx.location, error: route.error });
    });
  };

  render(): JSX.Element {
    const { history } = this.props;
    const { relay, route, location, error } = this.state;

    if (error) {
      return <ErrorPage error={error} />;
    }

    return (
      <RelayEnvironmentProvider environment={relay}>
        <HistoryContext.Provider value={history}>
          <LocationContext.Provider value={location}>
            <AppStyles />
            <AppToolbar />
            <AppContent>
              {route?.component
                ? React.createElement(route.component, route.props)
                : null}
            </AppContent>
          </LocationContext.Provider>
        </HistoryContext.Provider>
      </RelayEnvironmentProvider>
    );
  }
}
