import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaidIcon from "@mui/icons-material/Paid";
import ShareIcon from "@mui/icons-material/Share";
import SchoolIcon from "@mui/icons-material/School";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import MuiDrawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AdjustIcon from "@mui/icons-material/Adjust";
import List from "@mui/material/List";
import { styled, useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { LOGOUT } from "../redux/actionTypes";
import { store } from "../redux/store";
import { enqueueSnackbar } from "notistack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import TaskIcon from "@mui/icons-material/Task";

export const drawerWidth = 220;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} - 8px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} - 8px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  height: 40,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxShadow: "rgba(47, 43, 61, 0.14) 0px 2px 6px 0px",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  
  const navigator = useNavigate();
  const theme = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    store.dispatch({ type: LOGOUT });
    enqueueSnackbar({ variant: "default", message: "You have logged out." });
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={() => setOpen(!open)} sx={{ mr: 0.5 }}>
          <AdjustIcon
            sx={{ color: theme.palette.primary.main, fontSize: 20 }}
          />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ width: "100%", bgcolor: "background.paper" }} component="nav">
        <ListItemButton onClick={() => navigator("/dashboard")}>
          <ListItemIcon>
            <DashboardIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => navigator("/income")}>
          <ListItemIcon>
            <PaidIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Income" />
        </ListItemButton>

        <ListItemButton onClick={() => navigator("/project")}>
          <ListItemIcon>
            <AccountTreeIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Project" />
        </ListItemButton>

        <ListItemButton onClick={() => navigator("/account")}>
          <ListItemIcon>
            <SupervisorAccountIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItemButton>

        <ListItemButton onClick={() => navigator("/skill-up")}>
          <ListItemIcon>
            <SchoolIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Skill Up" />
        </ListItemButton>

        <ListItemButton onClick={() => navigator("/share")}>
          <ListItemIcon>
            <ShareIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Share" />
        </ListItemButton>

        <ListItemButton onClick={() => navigator("/report")}>
          <ListItemIcon>
            <DocumentScannerIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Report" />
        </ListItemButton>

        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
