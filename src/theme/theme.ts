import { createTheme } from "@mui/material/styles";

/**
 * FluxBoard M3 Design System
 * Focus on elevation, typography, and responsive grid layouts.
 */
declare module "@mui/material/styles" {
  interface Palette {
    surface: Palette["primary"];
  }
  interface PaletteOptions {
    surface?: PaletteOptions["primary"];
  }
  interface PaletteColor {
    onPrimary?: string;
    primaryContainer?: string;
    onPrimaryContainer?: string;
    onSecondary?: string;
    secondaryContainer?: string;
    onSecondaryContainer?: string;
    onError?: string;
    errorContainer?: string;
    onErrorContainer?: string;
    onSurface?: string;
    surfaceVariant?: string;
    onSurfaceVariant?: string;
    outline?: string;
  }
  interface SimplePaletteColorOptions {
    onPrimary?: string;
    primaryContainer?: string;
    onPrimaryContainer?: string;
    onSecondary?: string;
    secondaryContainer?: string;
    onSecondaryContainer?: string;
    onError?: string;
    errorContainer?: string;
    onErrorContainer?: string;
    onSurface?: string;
    surfaceVariant?: string;
    onSurfaceVariant?: string;
    outline?: string;
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6750A4",
      onPrimary: "#FFFFFF",
      primaryContainer: "#EADDFF",
      onPrimaryContainer: "#21005D",
    },
    secondary: {
      main: "#625B71",
      onSecondary: "#FFFFFF",
      secondaryContainer: "#E8DEF8",
      onSecondaryContainer: "#1D192B",
    },
    error: {
      main: "#B3261E",
      onError: "#FFFFFF",
      errorContainer: "#F9DEDC",
      onErrorContainer: "#410E0B",
    },
    background: {
      default: "#FEF7FF",
      paper: "#FFFFFF",
    },
    surface: {
      main: "#FEF7FF",
      onSurface: "#1D1B20",
      surfaceVariant: "#E7E0EC",
      onSurfaceVariant: "#49454F",
      outline: "#79747E",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 400,
      fontSize: "2.125rem",
      lineHeight: 1.235,
      letterSpacing: "0.00735em",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.6,
      letterSpacing: "0.0075em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "0.03125em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
      letterSpacing: "0.01786em",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // M3 Medium corners
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "none",
          border: "1px solid #E7E0EC",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#F7F2FA", // Surface Tint
            boxShadow: "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100, // Fully rounded buttons
          padding: "10px 24px",
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
  },
});
