/**
 * Next.js web application route (page) example.
 *
 * @see https://nextjs.org/docs/basic-features/pages
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { css } from "@emotion/react";

export default function Home(): JSX.Element {
  return (
    <p
      css={css`
        margin-top: 30%;
        text-align: center;
        font-weight: bold;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, sans-serif;
      `}
    >
      Next.js app skeleton.
    </p>
  );
}
