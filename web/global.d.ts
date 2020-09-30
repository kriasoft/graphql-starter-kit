/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { Theme as ThemeBase } from "./theme";

declare module "@emotion/react" {
  /* eslint-disable-next-line @typescript-eslint/no-empty-interface */
  interface Theme extends ThemeBase {}
}
