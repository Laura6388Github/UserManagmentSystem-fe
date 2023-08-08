import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "../theme";
const ThemeModeContext = createContext();

export const ThemeModeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage(
    "theme",
    window.matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light"
  );

  const setThemeMode = (e) => {
    setTheme(e);
  };

  const value = useMemo(
    () => ({
      theme,
      setThemeMode,
    }), // eslint-disable-next-line
    [theme]
  );
  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  return useContext(ThemeModeContext);
};
