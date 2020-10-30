/**
 * Custom Next.js `Document` component.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-document
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import * as React from "react";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { extractCritical } from "@emotion/server";

export default class AppDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): ReturnType<typeof Document.getInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);

    return {
      ...initialProps,
      styles: (
        <React.Fragment>
          {initialProps.styles}
          <style
            data-emotion-css={styles.ids.join(" ")}
            dangerouslySetInnerHTML={{ __html: styles.css }}
          />
        </React.Fragment>
      ),
    };
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
