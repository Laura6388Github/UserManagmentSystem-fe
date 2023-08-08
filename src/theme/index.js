import { createTheme } from "@mui/material";


export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7367f0",
      light: "#9e95f5",
      dark: "#4839eb",
    },
    secondary: {
      main: "#82868b",
      light: "#9ca0a4",
      dark: "#696d71",
    },
    success: {
      main: "#28c76f",
      light: "#48da89",
      dark: "#1f9d57",
    },
    warning: {
      main: "#ff9f43",
      light: "#ffb976",
      dark: "#ff8510",
    },
    info: {
      main: "#00cfe8",
      light: "#1ce7ff",
      dark: "#00a1b5",
    },
    error: {
      main: "#ea5455",
      light: "#f08182",
      dark: "#e42728",
    },
    background: {
      default: "#F8F7FA",
    },
  },
  typography: {
    fontFamily: "Inter",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "rgba(47, 43, 61, 0.14) 0px 2px 6px 0px",
          borderRadius: 10,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          height: 40,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});


export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#7367f0",
      light: "#9e95f5",
      dark: "#4839eb",
    },
    secondary: {
      main: "#82868b",
      light: "#9ca0a4",
      dark: "#696d71",
    },
    success: {
      main: "#28c76f",
      light: "#48da89",
      dark: "#1f9d57",
    },
    warning: {
      main: "#ff9f43",
      light: "#ffb976",
      dark: "#ff8510",
    },
    info: {
      main: "#00cfe8",
      light: "#1ce7ff",
      dark: "#00a1b5",
    },
    error: {
      main: "#ea5455",
      light: "#f08182",
      dark: "#e42728",
    },
  },
  typography: {
    fontFamily: "Inter",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "rgba(47, 43, 61, 0.14) 0px 2px 6px 0px",
          borderRadius: 10,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          height: 40,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});
