import {
  Box,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { useSnackbar } from "notistack";
import { apis } from "../apis";
import PasswordField from "../components/PasswordField";
import { useSelector } from "react-redux";
import { strings } from "../constants/strings";
import { useNavigate } from "react-router";
import { LoadingButton } from "@mui/lab";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { companies, offices, teams, userIds } = useSelector(
    (state) => state.common
  );
  const password = useRef({});
  password.current = watch("password", "");
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading } = useSelector((state) => state.common);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (isLoading) return;
    try {
      data.userId = String(data.userId).toLowerCase();
      const res = await apis.signup(data);
      enqueueSnackbar({
        variant: "success",
        message: res.data?.message,
      });
      navigate("/login");
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data.message || strings.SERVER_ERROR,
      });
    }
  };

  const validateUserId = (value) => {
    if (userIds.includes(value)) {
      return "This User Id is already taken";
    }
    return true;
  };

  return (
    <Box maxWidth={400} minWidth={400}>
      <Stack
        direction="column"
        spacing={2}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Welcome to Sign Up!
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
            validate: validateUserId,
          })}
        />
        <TextField
          variant="standard"
          label="Fullname"
          type="text"
          error={Boolean(errors.fullname)}
          helperText={errors.fullname && errors.fullname.message}
          {...register("fullname", { required: "Full name is required" })}
        />
        <PasswordField
          variant="standard"
          label="Password"
          error={Boolean(errors.password)}
          helperText={errors.password && errors.password.message}
          register={register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
        />
        <PasswordField
          variant="standard"
          label="Confirm Password"
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword && errors.confirmPassword.message}
          register={register("confirmPassword", {
            required: "Confirm password is required",
            minLength: { value: 6, message: "At least 6 characters" },
            validate: (value) =>
              value === password.current ||
              "The confirm password does not match",
          })}
        />
        <TextField
          select
          variant="standard"
          type="text"
          label="Company"
          defaultValue=""
          helperText={errors.company && errors.company.message}
          error={Boolean(errors.company)}
          {...register("company", { required: "This field is required" })}
        >
          {companies.map((option, index) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          variant="standard"
          type="text"
          label="Office"
          defaultValue=""
          helperText={errors.office && errors.office.message}
          error={Boolean(errors.office)}
          {...register("office", { required: "This field is required" })}
        >
          {offices.map((option, index) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          variant="standard"
          type="text"
          label="Team"
          defaultValue=""
          helperText={errors.team && errors.team.message}
          error={Boolean(errors.team)}
          {...register("team", { required: "This field is required" })}
        >
          {teams.map((option, index) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <LoadingButton variant="contained" type="submit" loading={isLoading}>
          Sign Up
        </LoadingButton>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="p">Already have an account?</Typography>
          <Link
            fontWeight="bold"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Login
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SignUpPage;
