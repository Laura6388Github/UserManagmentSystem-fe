import "./App.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./router/routes";
import { useEffect } from "react";
import { store } from "./redux/store";
import { apis } from "./apis";
import { LOGIN_SUCCESS, SET_CONSTANTS, SET_USERIDS } from "./redux/actionTypes";
import { strings } from "./constants/strings";
import { useSnackbar } from "notistack";
import { useAuth } from "./hooks/useAuth";
import jwtDecode from "jwt-decode";

function App() {
  const { enqueueSnackbar } = useSnackbar();
  const { tokens, logout } = useAuth();
  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: {
            constants: { companies, offices, teams },
          },
        } = await apis.getConstans();
        const res = await apis.getUserIds();
        store.dispatch({
          type: SET_CONSTANTS,
          payload: { companies, offices, teams },
        });
        store.dispatch({ type: SET_USERIDS, payload: res.data.userIds });
      } catch (err) {
        enqueueSnackbar({
          variant: "error",
          message: err.response?.data.message || strings.SERVER_ERROR,
        });
      }
    };
    init();
    const initAuth = async () => {
      try {
        store.dispatch({
          type: LOGIN_SUCCESS,
          payload: jwtDecode(tokens?.accessToken),
        });
      } catch (err) {
        logout();
        enqueueSnackbar({
          variant: "error",
          message: "Token expired or invalid",
        });
      }
    };
    if (tokens) initAuth();
  }, [enqueueSnackbar, logout, tokens]);

  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
      }, 1000 * 60 * 60 * 24);
    };

    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keydown", resetTimer);
    resetTimer();
    return () => {
      document.removeEventListener("mousemove", resetTimer);
      document.removeEventListener("keydown", resetTimer);
      clearTimeout(timer);
    };
  }, [logout]);

  return <RouterProvider router={routes} />;
}

export default App;
