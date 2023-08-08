import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import {
  Avatar,
  Badge,
  Card,
  Menu,
  MenuItem,
  Stack,
  alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Logout } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { store } from "../redux/store";
import { LOGOUT } from "../redux/actionTypes";
import { useSnackbar } from "notistack";
import { useAuth } from "../hooks/useAuth";
import { toCapitalize } from "../utils/toCapitalize";
import ThemeToggleButton from "../components/ThemeToggleButton";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    store.dispatch({ type: LOGOUT });
    enqueueSnackbar({ variant: "default", message: "You have logged out." });
  };

  const handleGoToProfilePage = () => {
    setAnchorEl(null);
    navigate("/profile");
  };
  return (
    <Box
      sx={{
        pt: 2,
        px: 0.5,
        mx: 1.5,
        pb: 0.5,
        position: "sticky",
        top: 0,
        left: 0,
        backgroundColor: theme.palette.background.default,
        zIndex: theme.zIndex.appBar,
        borderBottomRightRadius: 18,
        borderBottomLeftRadius: 18,
      }}
    >
      <Card>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Hi {user && toCapitalize(user.userId)}, Welcome!
          </Typography>
          <Stack direction="row" alignItems="center">
            <ThemeToggleButton />
            <IconButton onClick={handleOpenMenu}>
              <Badge
                color="secondary"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                count={2}
              >
                <Avatar
                  sx={{ bgcolor: theme.palette.primary.main }}
                  // src="/static/images/avatar/1.jpg"
                >
                  {user?.fullname[0].toUpperCase()}
                </Avatar>
              </Badge>
            </IconButton>
          </Stack>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleGoToProfilePage} disableRipple>
              <AccountCircleIcon />
              Profile
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout} disableRipple>
              <Logout />
              Logout
            </MenuItem>
          </StyledMenu>
        </Toolbar>
      </Card>
    </Box>
  );
};

export default Header;
