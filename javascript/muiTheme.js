import { createMuiTheme } from "@material-ui/core/styles";

const primary = "#7FB069";
const primaryLight = "#a1c591";
const primaryDark = "#61904c";
const secondary = "#E6AA68";
const secondaryLight = "#efc89d";
const secondaryDark = "#dd8c33";
const background = "#FFFBBD";
const backgroundLight = "#fffffa";
const backgroundDark = "#fff780";
const alert = "#CA3C25";
const alertLight = "#df624e";
const alertDark = "#962d1c";
const dark = "#1D1A05";
const darkLight = "#787878";
const light = "#FFF";
const lightDark = "#fffbbd";

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: primary,
      light: primaryLight,
      dark: primaryDark,
    },
    secondary: {
      main: secondary,
      light: secondaryLight,
      dark: secondaryDark,
    },
    background: {
      main: background,
      light: backgroundLight,
      dark: backgroundDark,
    },
    alert: {
      main: alert,
      light: alertLight,
      dark: alertDark,
    },
    dark: {
      main: dark,
      light: darkLight,
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
    h5: { color: dark, fontSize: 18, whiteSpace: "pre-wrap" },
    h6: { color: dark, whiteSpace: "pre-wrap" },
    subtitle1: {
      color: dark,
      fontSize: 18,
      letterSpacing: 1.1,
      whiteSpace: "pre-wrap",
    },
    subtitle2: {
      color: dark,
      fontSize: 14,
      whiteSpace: "pre-wrap",
    },
    body1: { color: dark, fontSize: 13, lineHeight: 2, whiteSpace: "pre-wrap" },
    body2: { color: dark, fontSize: 12, whiteSpace: "pre-wrap" },
    button: { color: dark, whiteSpace: "pre-wrap" },
    caption: { color: dark, fontSize: 12, whiteSpace: "pre-wrap" },
    overline: { color: dark, whiteSpace: "pre-wrap" },

    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: {
      xs: 0,
      sm: 600,
      md: 1025,
      lg: 1280,
      xl: 1920,
    },
  },

  globalClasses: {
    inputContainer: {
      margin: `${defaultTheme.spacing(2)}px 0 0 0`,
      position: "relative",
    },
    icon: {
      fill: dark,
    },
    badge: {
      backgroundColor: alert,
      color: "white",
    },
    deleteBtn: {
      marginLeft: 0,
      backgroundColor: alert,
      color: light,
      "&:hover": {
        backgroundColor: alertDark,
      },
    },
    returnBtn: {
      backgroundColor: secondary,
      color: light,
      "&:hover": {
        backgroundColor: secondaryDark,
      },
    },
  },
});

export default theme;
