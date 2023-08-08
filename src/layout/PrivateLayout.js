import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import { toCapitalize } from "../utils/toCapitalize";
import { socket } from "../apis/socket";
import Header from "../components/Header";

export default function PrivateLayout({ children }) {
  const { isLoading } = useSelector((state) => state.common);
  const { enqueueSnackbar } = useSnackbar();
  const { tokens } = useAuth();

  React.useEffect(() => {
    const showNotification = async (e) => {
      try {
        enqueueSnackbar({
          variant: "success",
          message: toCapitalize(e.message),
        });
        if ("Notification" in window) {
          const permission = Notification.requestPermission();
          if (permission === "granted") {
            new Notification("Income", {
              body: toCapitalize(e.message),
            });
            new Notification("Account", {
              body: toCapitalize(e.message),
            });
          } else if (permission === "denied") {
            console.log("Desktop Notification denied");
          } else if (permission === "default") {
            console.log("Desktop Notification Permission prompt dismissed");
          }
        }
      } catch (e) {}
    };
    socket.on("update_dashboard", showNotification);
    return () => {
      socket.off("update_dashboard", showNotification);
    };
  }, [enqueueSnackbar]);

  if (!tokens) return <Navigate to={`/login`} />;
  else
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flex: 1 }} width={`calc(100% - 220px)`}>
          <Header />
          {isLoading && <LinearProgress sx={{ mr: 2, ml: 2 }} />}
          <Box component="main" flex={1} p={2}>
            {children}
          </Box>
        </Box>
      </Box>
    );
}
