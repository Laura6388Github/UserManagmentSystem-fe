import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import PasswordField from "../components/PasswordField";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../hooks/useAuth";
import { apis } from "../apis";
import { store } from "../redux/store";
import { enqueueSnackbar } from "notistack";
import { SET_USERIDS, UPDATE_USER } from "../redux/actionTypes";
import { strings } from "../constants/strings";

const ProfilePage = () => {
  const { isLoading } = useSelector((state) => state.common);
  const { user } = useSelector((state) => state.auth);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { logout } = useAuth();
  const updateUserForm = useForm();
  const resetPassForm = useForm();
  const { companies, offices, teams, userIds } = useSelector(
    (state) => state.common
  );
  const newPassword = useRef({});
  newPassword.current = resetPassForm.watch("newPassword", "");
  const validateUserId = (value) => {
    if (
      userIds.includes(value.toLowerCase()) &&
      value.toLowerCase() !== user.userId
    ) {
      return "This User Id is already taken";
    }
    return true;
  };

  const handleDeleteAccount = async () => {
    try {
      if (isLoading) return;
      const res = await apis.deleteUser(user._id);
      setOpenDeleteDialog(false);
      logout();
      enqueueSnackbar({ variant: "success", message: res.data?.message });
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data.message || strings.SERVER_ERROR,
      });
    }
  };
  const handleEditAccount = async (data) => {
    try {
      if (isLoading) return;
      data.userId = data.userId.toLowerCase();
      const res = await apis.updateUser(user._id, data);
      store.dispatch({ type: UPDATE_USER, payload: res.data.user });
      const {
        data: { userIds },
      } = await apis.getUserIds();
      store.dispatch({ type: SET_USERIDS, payload: userIds });
      enqueueSnackbar({ variant: "success", message: res.data?.message });
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data.message || strings.SERVER_ERROR,
      });
    }
  };
  const handleResetPassword = async (data) => {
    try {
      if (isLoading) return;
      const { oldPassword, newPassword } = data;
      const res = await apis.resetPassword({ oldPassword, newPassword });
      enqueueSnackbar({ variant: "success", message: res.data?.message });
      // resetPassForm.reset();
    } catch (err) {
      enqueueSnackbar({ variant: "error", message: err.response.data.message });
    }
  };

  return (
    <>
      {user && (
        <Stack direction="column" spacing={2} maxWidth={400} m={2}>
          <Card>
            <CardHeader title="Basic Information" />
            <CardContent>
              <Stack
                direction="column"
                spacing={2}
                component="form"
                onSubmit={updateUserForm.handleSubmit(handleEditAccount)}
              >
                <TextField
                  variant="standard"
                  label="User ID (ip message)"
                  type="text"
                  defaultValue={user.userId}
                  helperText={
                    updateUserForm.formState.errors.userId
                      ? updateUserForm.formState.errors.userId.message
                      : "We recommand to use the same as your ID of ip message."
                  }
                  error={Boolean(updateUserForm.formState.errors.userId)}
                  {...updateUserForm.register("userId", {
                    required: "User ID is required",
                    validate: validateUserId,
                  })}
                />
                <TextField
                  variant="standard"
                  label="Fullname"
                  type="text"
                  defaultValue={user.fullname}
                  error={Boolean(updateUserForm.formState.errors.fullname)}
                  helperText={
                    updateUserForm.formState.errors.fullname &&
                    updateUserForm.formState.errors.fullname.message
                  }
                  {...updateUserForm.register("fullname", {
                    required: "Full name is required",
                  })}
                />
                <TextField
                  select
                  variant="standard"
                  type="text"
                  label="Company"
                  defaultValue={user.company}
                  helperText={
                    updateUserForm.formState.errors.company &&
                    updateUserForm.formState.errors.company.message
                  }
                  error={Boolean(updateUserForm.formState.errors.company)}
                  {...updateUserForm.register("company", {
                    required: "This field is required",
                  })}
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
                  defaultValue={user.office}
                  helperText={
                    updateUserForm.formState.errors.office &&
                    updateUserForm.formState.errors.office.message
                  }
                  error={Boolean(updateUserForm.formState.errors.office)}
                  {...updateUserForm.register("office", {
                    required: "This field is required",
                  })}
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
                  defaultValue={user.team}
                  helperText={
                    updateUserForm.formState.errors.team &&
                    updateUserForm.formState.errors.team.message
                  }
                  error={Boolean(updateUserForm.formState.errors.team)}
                  {...updateUserForm.register("team", {
                    required: "This field is required",
                  })}
                >
                  {teams.map((option, index) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <LoadingButton
                    variant="contained"
                    loading={isLoading}
                    type="submit"
                  >
                    Update Now
                  </LoadingButton>
                </CardActions>
              </Stack>
            </CardContent>
          </Card>

          <Divider />

          <Card>
            <CardHeader title="Reset Password" />
            <CardContent>
              <Stack
                direction="column"
                spacing={2}
                component="form"
                onSubmit={resetPassForm.handleSubmit(handleResetPassword)}
              >
                <PasswordField
                  variant="standard"
                  label="Old Password"
                  error={Boolean(resetPassForm.formState.errors.oldPassword)}
                  helperText={
                    resetPassForm.formState.errors.oldPassword &&
                    resetPassForm.formState.errors.oldPassword.message
                  }
                  register={resetPassForm.register("oldPassword", {
                    required: "Old password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                  })}
                />
                <PasswordField
                  variant="standard"
                  label="New Password"
                  error={Boolean(resetPassForm.formState.errors.newPassword)}
                  helperText={
                    resetPassForm.formState.errors.newPassword &&
                    resetPassForm.formState.errors.newPassword.message
                  }
                  register={resetPassForm.register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                  })}
                />
                <PasswordField
                  variant="standard"
                  label="Confirm Password"
                  error={Boolean(
                    resetPassForm.formState.errors.confirmPassword
                  )}
                  helperText={
                    resetPassForm.formState.errors.confirmPassword &&
                    resetPassForm.formState.errors.confirmPassword.message
                  }
                  register={resetPassForm.register("confirmPassword", {
                    required: "Confirm password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                    validate: (value) =>
                      value === newPassword.current ||
                      "The confirm password does not match",
                  })}
                />
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={isLoading}
                  >
                    Reset Now
                  </LoadingButton>
                  <Button variant="text" onClick={() => resetPassForm.reset()}>
                    Cancel
                  </Button>
                </CardActions>
              </Stack>
            </CardContent>
          </Card>
          <Divider />
          <LoadingButton
            variant="contained"
            color="error"
            loading={isLoading}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Close Account
          </LoadingButton>
          <Dialog
            open={openDeleteDialog}
            onclose={() => setOpenDeleteDialog(false)}
            maxWidth="xs"
          >
            <DialogTitle>Delete your account</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to delete your account now?
                <br />
                We will delete your account and other information related to
                your account permanently.
                <br />
                Please consider to delete your account.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <LoadingButton variant="contained" onClick={handleDeleteAccount}>
                Delete
              </LoadingButton>
              <Button variant="text" onClick={() => setOpenDeleteDialog(false)}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      )}
    </>
  );
};

export default ProfilePage;
