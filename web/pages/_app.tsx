/**
 * Custom Next.js `App` component.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-app
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import { cache } from "@emotion/css";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import type { AppProps } from "next/app";

import { lightTheme, darkTheme } from "../theme";
import { createRelay, ResetRelayContext } from "../relay";

function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;

  // Allows switching between light and dark modes
  const [theme, setTheme] = React.useState(lightTheme);
  React.useCallback(() => {
    setTheme((x) => (x.mode === "light" ? darkTheme : lightTheme));
  }, []);

  // Allows to reset Relay's local store
  const [relay, setRelay] = React.useState(createRelay);
  const resetRelay = React.useCallback(() => {
    setRelay(createRelay());
  }, []);

  return (
    <RelayEnvironmentProvider environment={relay}>
      <ResetRelayContext.Provider value={resetRelay}>
        <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </ResetRelayContext.Provider>
    </RelayEnvironmentProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async function getInitialProps(appContext) {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext)

//   return { ...appProps }
// };

export default App;
