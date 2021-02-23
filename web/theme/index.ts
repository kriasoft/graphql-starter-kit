/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

import { createMuiTheme } from "@material-ui/core";
import { components } from "./components";

/**
 * Customized Material UI theme.
 *
 * @see https://next.material-ui.com/customization/default-theme/
 */
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      `-apple-system`,
      `"BlinkMacSystemFont"`,
      `"Segoe UI"`,
      `"Roboto"`,
      `"Oxygen"`,
      `"Ubuntu"`,
      `"Cantarell"`,
      `"Fira Sans"`,
      `"Droid Sans"`,
      `"Helvetica Neue"`,
      `sans-serif`,
    ].join(","),
  },

  components,
});

theme.typography.h1.fontSize = "2em";
theme.typography.h2.fontSize = "1.5em";
theme.typography.h3.fontSize = "1.3em";
theme.typography.h4.fontSize = "1em";
theme.typography.h5.fontSize = "0.8em";
theme.typography.h6.fontSize = "0.7em";

export default theme;
