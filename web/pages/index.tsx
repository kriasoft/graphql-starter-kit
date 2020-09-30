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
      css={(theme) => css`
        margin-top: 30%;
        text-align: center;
        font-weight: bold;
        font-family: ${theme.typography.fontFamily};
      `}
    >
      Next.js app skeleton.
    </p>
  );
}
