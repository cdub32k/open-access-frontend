import { createMuiTheme } from "@material-ui/core/styles";

const primary = "#7FB069";
const secondary = "#E6AA68";
const background = "#FFFBBD";
const alert = "#CA3C25";
const dark = "#1D1A05";
const darkLight = "#51490e";
const light = "#FFF";
const lightDark = "#fffbbd";

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: primary,
      light: "#a1c591",
      dark: "#61904c",
    },
    secondary: {
      main: secondary,
      light: "#efc89d",
      dark: "#dd8c33",
    },
    background: {
      main: background,
      light: "#fffffa",
      dark: "#fff780",
    },
    alert: {
      main: alert,
      light: "#df624e",
      dark: "#962d1c",
    },
    dark: {
      main: dark,
      light: "#51490e",
    },
    light: {
      main: light,
      dark: lightDark,
    },
    text: {
      primary: dark,
      secondary: darkLight,
      light: "white",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    h1: { color: dark, whiteSpace: "pre-wrap" },
    h2: { color: dark, fontSize: 42, fontWeight: 700, whiteSpace: "pre-wrap" },
    h3: { color: dark, fontSize: 28, whiteSpace: "pre-wrap" },
    h4: {
      fontSize: 18,
      fontWeight: 700,
      color: dark,
      whiteSpace: "pre-wrap",
    },
    h5: { color: dark, fontSize: 18, fontWeight: 700, whiteSpace: "pre-wrap" },
    h6: { color: dark, whiteSpace: "pre-wrap" },
    subtitle1: {
      color: dark,
      fontSize: 18,
      letterSpacing: 1.1,
      whiteSpace: "pre-wrap",
    },
    subtitle2: {
      color: dark,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: "pre-wrap",
    },
    body1: { color: dark, fontSize: 13, lineHeight: 2, whiteSpace: "pre-wrap" },
    body2: { color: dark, fontSize: 10, whiteSpace: "pre-wrap" },
    button: { color: dark, whiteSpace: "pre-wrap" },
    caption: { color: dark, fontSize: 12, whiteSpace: "pre-wrap" },
    overline: { color: dark, whiteSpace: "pre-wrap" },

    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
  breakpoints: {
    keys: ["xs", "xm", "md", "lg", "xl"],
    values: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1280,
      xl: 1920,
    },
  },

  globalClasses: {
    inputContainer: {
      margin: `${defaultTheme.spacing(2)}px 0 0 0`,
    },
    icon: {
      fill: dark,
    },
    badge: {
      backgroundColor: alert,
      color: "white",
    },
  },
});

export default theme;
