import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apis } from "../apis";
import { useSnackbar } from "notistack";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import { useForm } from "react-hook-form";
import { _roles } from "../constants";
import { strings } from "../constants/strings";
import PasswordField from "../components/PasswordField";
import { store } from "../redux/store";
import { SET_USERIDS } from "../redux/actionTypes";
import { toCapitalize } from "../utils/toCapitalize";

const AdminPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { companies, offices, teams, userIds } = useSelector(
    (state) => state.common
  );

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const password = React.useRef({});
  password.current = watch("password", "");

  const { enqueueSnackbar } = useSnackbar();

  const [selectedRow, setSelectedRow] = React.useState(null);

  const columns = [
    { field: "userId", headerName: "User ID" },
    { field: "fullname", headerName: "Name" },
    { field: "role", headerName: "Role", type: "string" },
    {
      field: "company",
      headerName: "Company",
      type: "Object",
      valueFormatter: (params) => getCompanyName(params.value),
    },
    {
      field: "office",
      headerName: "Office",
      type: "Object",
      valueFormatter: (params) => getOfficeName(params.value),
    },
    {
      field: "team",
      headerName: "Team",
      type: "Object",
      valueFormatter: (params) => getTeamName(params.value),
    },
    {
      field: "isActive",
      headerName: "Is active",
      type: "boolean",
    },
    {
      field: "isLocked",
      headerName: "Is locked",
      type: "boolean",
    },
    {
      field: "updatedAt",
      headerName: "Updated at",
      type: "date",
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "createdAt",
      headerName: "Created at",
      type: "date",
      valueGetter: (params) => new Date(params.value),
    },
  ];

  const getCompanyName = (id) => {
    var name;
    companies.forEach((e) => {
      if (e._id === id) name = e.name;
    });
    return name;
  };
  const getOfficeName = (id) => {
    var name;
    offices.forEach((e) => {
      if (e._id === id) name = e.name;
    });
    return name;
  };
  const getTeamName = (id) => {
    var name;
    teams.forEach((e) => {
      if (e._id === id) name = e.name;
    });
    return name;
  };

  const handleCreateUser = async (data) => {
    try {
      data.userId = data.userId.toLowerCase();
      const res = await apis.createUser(data);
      const {
        data: { userIds },
      } = await apis.getUserIds();
      fetchUsers();
      store.dispatch({ type: SET_USERIDS, payload: userIds });
      enqueueSnackbar({ variant: "success", message: res.data?.message });
      setOpenCreateDialog(false);
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data.message || strings.SERVER_ERROR,
      });
    }
  };

  const handleEditUser = async (data) => {
    try {
      data.userId = data.userId.toLowerCase();
      const res = await apis.updateUser(selectedRow._id, data);

      const {
        data: { userIds },
      } = await apis.getUserIds();
      fetchUsers();
      store.dispatch({ type: SET_USERIDS, payload: userIds });

      setSelectedRow(null);
      enqueueSnackbar({ variant: "success", message: res.data?.message });
      setOpenEditDialog(false);
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data.message || strings.SERVER_ERROR,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await apis.deleteUser(selectedRow._id);

      fetchUsers();
      setSelectedRow(null);
      enqueueSnackbar({ variant: "success", message: res.data?.message });
      setOpenDeleteDialog(false);
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data.message || strings.SERVER_ERROR,
      });
    }
  };

  const handleCloseCreateDialog = () => {
    reset();
    setOpenCreateDialog(false);
  };
  const handleCloseEditDialog = () => {
    reset();
    setOpenEditDialog(false);
  };
  const handleCloseDeleteDialog = () => {
    reset();
    setOpenDeleteDialog(false);
  };

  const validateUserId = (value) => {
    if (userIds.includes(value.toLowerCase())) {
      return "This User Id is already taken";
    }
    return true;
  };
  const validateUserIdForEdit = (value) => {
    const array = userIds.filter((e) => e !== selectedRow.userId);
    if (array.includes(value.toLowerCase())) {
      return "This User Id is already taken";
    }
    return true;
  };

  const fetchUsers = React.useCallback(async () => {
    try {
      var {
        data: { users },
      } = await apis.getUsers();
      setRows(users);
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data?.message,
      });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
    return () => {};
  }, [fetchUsers]);

  return (
    <Box>
      {openCreateDialog && (
        <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
          <DialogTitle>Create a new user</DialogTitle>
          <DialogContent>
            <Stack
              direction="column"
              gap={1}
              minWidth={400}
              component="form"
              onSubmit={handleSubmit(handleCreateUser)}
            >
              <TextField
                variant="standard"
                label="User ID"
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
                helperText={
                  errors.confirmPassword && errors.confirmPassword.message
                }
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
              <TextField
                select
                variant="standard"
                type="text"
                label="Role"
                defaultValue=""
                helperText={errors.role && errors.role.message}
                error={Boolean(errors.role)}
                {...register("role", { required: "This field is required" })}
              >
                {_roles.map((option, index) => (
                  <MenuItem key={option} value={option}>
                    {toCapitalize(option)}
                  </MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Is active"
                {...register("isActive")}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Is locked"
                {...register("isLocked")}
              />
              <DialogActions>
                <Button variant="contained" type="submit">
                  Create
                </Button>
                <Button onClick={handleCloseCreateDialog}>Cancel</Button>
              </DialogActions>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
      {openEditDialog && selectedRow && (
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Stack
              direction="column"
              gap={1}
              minWidth={400}
              component="form"
              onSubmit={handleSubmit(handleEditUser)}
            >
              <TextField
                variant="standard"
                label="User ID"
                type="text"
                defaultValue={selectedRow?.userId}
                helperText={
                  errors.userId
                    ? errors.userId.message
                    : "We recommand to use the same as your ID of ip message."
                }
                error={Boolean(errors.userId)}
                {...register("userId", {
                  required: "User ID is required",
                  validate: validateUserIdForEdit,
                })}
              />
              <TextField
                variant="standard"
                label="Fullname"
                type="text"
                defaultValue={selectedRow?.fullname}
                error={Boolean(errors.fullname)}
                helperText={errors.fullname && errors.fullname.message}
                {...register("fullname", { required: "Full name is required" })}
              />
              <TextField
                select
                variant="standard"
                type="text"
                label="Company"
                defaultValue={selectedRow?.company}
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
                defaultValue={selectedRow?.office}
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
                defaultValue={selectedRow?.team}
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
              <TextField
                select
                variant="standard"
                type="text"
                label="Role"
                defaultValue={selectedRow?.role}
                helperText={errors.role && errors.role.message}
                error={Boolean(errors.role)}
                {...register("role", { required: "This field is required" })}
              >
                {_roles.map((option, index) => (
                  <MenuItem key={option} value={option}>
                    {toCapitalize(option)}
                  </MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={selectedRow?.isActive}
                    {...register("isActive")}
                  />
                }
                label="Is active"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={selectedRow?.isLocked}
                    {...register("isLocked")}
                  />
                }
                label="Is locked"
              />
              <DialogActions>
                <Button variant="contained" type="submit">
                  Edit
                </Button>
                <Button onClick={handleCloseEditDialog}>Cancel</Button>
              </DialogActions>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
      {openDeleteDialog && selectedRow && (
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Are you sure to delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              We will delete <strong>{selectedRow?.userId}</strong> permanently.
              <br />
              Please consider to delete this user.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleDeleteUser}>
              Delete
            </Button>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              gap: 1,
            }}
          >
            <Typography variant="h5">User Manage</Typography>
            <Box gap={1} display="flex">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  reset();
                  setOpenCreateDialog(true);
                }}
              >
                Create
              </Button>
              <Button
                variant="contained"
                color="warning"
                disabled={!selectedRow}
                onClick={() => {
                  reset();
                  setOpenEditDialog(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={!selectedRow}
                onClick={() => {
                  reset();
                  setOpenDeleteDialog(true);
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
          <DataGrid
            sx={{ height: 600 }}
            rows={rows}
            columns={columns}
            getRowId={(params) => params._id}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            onRowClick={(params) => {setSelectedRow(params.row)}}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminPage;
