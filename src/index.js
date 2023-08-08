import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Backdrop, CircularProgress } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeModeProvider } from "./hooks/useThemeModeContext";

const LazyApp = lazy(() => import("./App"));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <ThemeModeProvider>
          <Suspense
            fallback={
              <Backdrop open={true}>
                <CircularProgress />
              </Backdrop>
            }
          >
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              autoHideDuration={3000}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline />
                <LazyApp />
              </LocalizationProvider>
            </SnackbarProvider>
          </Suspense>
        </ThemeModeProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
