import { Box, Link, Stack, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { store } from "../redux/store";
import { LOGIN_FALIED, LOGIN_SUCCESS } from "../redux/actionTypes";
import { useNavigate, Navigate } from "react-router-dom";
import { apis } from "../apis";
import { useSelector } from "react-redux";
import PasswordField from "../components/PasswordField";
import { useAuth } from "../hooks/useAuth";
import { strings } from "../constants/strings";
import jwtDecode from "jwt-decode";
import { LoadingButton } from "@mui/lab";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { tokens, login } = useAuth();
  const { isLoading } = useSelector((state) => state.common);

  const onSubmit = async (data) => {
    if (isLoading) return;
    data.userId = String(data.userId).toLowerCase();
    try {
      const res = await apis.login(data);
      login(res.data.tokens);
      const user = jwtDecode(res.data.tokens.accessToken);
      store.dispatch({
        type: LOGIN_SUCCESS,
        payload: user,
      });
      enqueueSnackbar({
        variant: "success",
        message: res.data?.message,
      });
      navigate("/dashboard");
    } catch (err) {
      store.dispatch({ type: LOGIN_FALIED });
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data.message || strings.SERVER_ERROR,
      });
    }
  };

  if (tokens) return <Navigate to="/dashboard" />;
  else
    return (
      <Box maxWidth={400} minWidth={400}>
        <Stack
          direction="column"
          spacing={2}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Welcome to Login!
          </Typography>
          <TextField
            variant="standard"
            label="User ID (ip message)"
            type="text"
            helperText={
              errors.userId
                ? errors.userId.message
                : "We recommand to use the same as your ID of ip message."
            }
            error={Boolean(errors.userId)}
            {...register("userId", {
              required: "User ID is required",
            })}
          />

          <PasswordField
            variant="standard"
            label="Password"
            helperText={errors.password && errors.password.message}
            error={Boolean(errors.password)}
            register={register("password", {
              minLength: { value: 6, message: "At least 6 characters" },
              required: "password is required",
            })}
          />

          <LoadingButton variant="contained" type="submit" loading={isLoading}>
            Login
          </LoadingButton>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="p">Don't have an account yet?</Typography>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
              fontWeight="bold"
            >
              Sign Up
            </Link>
          </Stack>
        </Stack>
      </Box>
    );
};

export default LoginPage;
