/**
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

const palette = Object.freeze({
  primary: "#3f51b5",
  secondary: "#303f9f",
  text: Object.freeze({
    primary: "",
    secondary: "",
    disabled: "",
  }),
});

const typography = Object.freeze({
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
  ].join(","),
});

export interface Theme {
  mode: "light" | "dark";
  palette: typeof palette;
  typography: typeof typography;
}

export const lightTheme: Theme = Object.freeze({
  mode: "light",
  palette: Object.freeze({
    ...palette,
    text: Object.freeze({
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.12)",
    }),
  }),
  typography,
});

export const darkTheme: Theme = Object.freeze({
  mode: "dark",
  palette: Object.freeze({
    ...palette,
    text: Object.freeze({
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
    }),
  }),
  typography,
});
