"use client";
import { createTheme } from "@mui/material/styles";
import { colors } from "@mui/material";
import { Afacad } from '@next/font/google'

export const afacad = Afacad({ subsets: ['latin'] })
type Theme = {
  mode?: "light" | "dark";
  windowWidth?: number;
  fontSize?: number;
};

export const theme = ({
  mode = "light",
  windowWidth = 1400,
  fontSize = 16,
}: Theme) =>
  createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "light" ? colors.blue[500] : colors.grey[700],
        contrastText: colors.common.white,
      },
      secondary: {
        main: mode === "light" ? colors.blueGrey[900] : colors.grey[100],
        contrastText:
          mode === "light" ? colors.common.white : colors.common.black,
      },
      background: {
        default: mode === "light" ? colors.common.white : colors.common.black,
        paper: mode === "light" ? colors.common.white : colors.common.black,
      },
      text: {
        primary: mode === "light" ? colors.common.black : colors.common.white,
        disabled: mode === "light" ? colors.grey[600] : colors.grey[400],
        secondary: mode === "light" ? colors.blue[500] : colors.blueGrey[200],
      },
      divider: mode === "light" ? colors.grey[300] : colors.grey[900],
      action: {
        hover: mode === "light" ? colors.blue[200] : colors.grey[500],
      },
      common: {
        black: colors.grey[800],
        white: colors.grey[100],
      },
      contrastThreshold: 3,
      error: {
        main: colors.red[500],
        contrastText: colors.common.white,
      },
    },
    components: {
      MuiSvgIcon: {
        defaultProps: {
          sx: {
            color: "text.primary",
            transition: "color 0.3s ease",
            ":hover": {
              color: "primary.main",
            },
            ":active": {
              color: "primary.contrastText",
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          sx: {
            ":hover": {
              cursor: "pointer",
            },
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          sx: {
            ":hover": {
              cursor: "pointer",
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          autoComplete: "off",
        }
      },
      MuiInput: {
        defaultProps: {
          autoComplete: "off",
        }
      },
      MuiInputBase: {
        defaultProps: {
          autoComplete: "off",
        }
      }
    },
    typography: {
      fontSize,
      fontFamily: afacad.style.fontFamily,
    },
    spacing: 10,
  });
