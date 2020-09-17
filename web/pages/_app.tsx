/**
 * Custom Next.js `App` component.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-app
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import React from "react";
import { CacheProvider } from "@emotion/react";
import { cache } from "@emotion/css";
import type { AppProps } from "next/app";

function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;

  return (
    <CacheProvider value={cache}>
      <Component {...pageProps} />
    </CacheProvider>
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
