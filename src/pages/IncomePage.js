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
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apis } from "../apis";
import { useSnackbar } from "notistack";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";
import { _status } from "../constants";
import { strings } from "../constants/strings";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useSelector } from "react-redux";



const IncomePage = () => {
  const [selectedRow, setSelectedRow] = React.useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const { companies, offices, teams } = useSelector((state) => state.common);

  const { isLoading } = useSelector((state) => state.common);


  const [projectInfo, setProjectInfo] = useState([]);
  const [projectName, setProjectName] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
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
  const columns = [
    { field: "userId", headerName: "User ID" },
    { field: "fullname", headerName: "Name" },
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
      field: "project",
      headerName: "Project",
      type: "string",
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      valueFormatter: (params) => `$ ${params.value}`,
    },
    {
      field: "description",
      headerName: "Description",
      type: "string",
    },
    {
      field: "status",
      headerName: "Status",
      type: "string",
    },
    {
      field: "incomeDate",
      headerName: "Income Date",
      type: "date",
      valueGetter: (params) => new Date(params.value),
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

  const handleCreateIncome = async (data) => {
    if (isLoading) return;
    try {
      data.incomeDate = new Date(data.incomeDate.$d);
      await apis.createIncome(data);
      setOpenCreateDialog(false);
      reset();
      await fetchIncomes();
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

  const handleEditIncome = async (data) => {
    if (isLoading) return;
    try {
      data.incomeDate = data.incomeDate.$d.toISOString();
      data.updatedAt = new Date();
      await apis.updateIncome(selectedRow._id, data);
      setSelectedRow(null);
      setOpenEditDialog(false);
      reset();
      await fetchIncomes();
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data.message || strings.SERVER_ERROR,
      });
    }
  };
  const handleCloseEditDialog = () => {
    reset();
    setOpenEditDialog(false);
  };

  const handleDeleteIncome = async () => {
    if (isLoading) return;
    try {
      await apis.deleteIncome(selectedRow._id);
      setSelectedRow(null);
      setOpenDeleteDialog(false);
      await fetchIncomes();
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data.message || strings.SERVER_ERROR,
      });
    }
  };
  const handleCloseDeletDialog = () => {
    reset();
    setOpenDeleteDialog(false);
    setSelectedRow(null);
  };

  const fetchIncomes = React.useCallback(async () => {
    try {
      const res = await apis.getIncomes();
      setRows(res.data.incomes.incomes);
      setProjectInfo(res.data.incomes.projectInfo);
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        type: err.response.data.message || strings.SERVER_ERROR,
      });
    }
  }, [enqueueSnackbar]);


  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const inputProjectName = (user) => {
    var array = [];
    projectInfo.forEach((e) => {
      if (e.userId === user) {

        array.push(e.projectName);
      }
    })
    setProjectName(array);
  }

  return (
    <Box>
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Add a new income</DialogTitle>
        <DialogContent>
          <Stack
            direction="column"
            gap={2}
            minWidth={400}
            component="form"
            onSubmit={handleSubmit(handleCreateIncome)}
          >

            <TextField
              select
              variant="standard"
              type="text"
              label="Project"
              helperText={errors.project && errors.project.message}
              error={Boolean(errors.project)}
              {...register("project", { required: "This field is required" })}
            >
              {projectName.map((option, index) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              variant="standard"
              label="Amount"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              inputProps={{ step: 0.00001 }}
              helperText={errors.amount && errors.amount.message}
              error={Boolean(errors.amount)}
              {...register("amount", {
                required: "This field is required",
              })}
            />

            <TextField
              variant="standard"
              label="Description"
              type="text"
              multiline
              rows={3}
              error={Boolean(errors.description)}
              helperText={errors.description && errors.description.message}
              {...register("description", {
                required: "This field is required",
              })}
            />

            <TextField
              select
              variant="standard"
              type="text"
              label="Status"
              defaultValue={_status[2]}
              helperText={errors.status && errors.status.message}
              error={Boolean(errors.status)}
              {...register("status", { required: "This field is required" })}
            >
              {_status.map((option, index) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Controller
              name="incomeDate"
              control={control}
              defaultValue={dayjs(Date.now())}
              render={({ field }) => (
                <DatePicker
                  label="Date Created"
                  value={field.value}
                  onChange={field.onChange}
                  disableFuture
                  sx={{ mt: 1 }}
                />
              )}
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
      {selectedRow && (
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Income</DialogTitle>
          <DialogContent>
            <Stack
              direction="column"
              gap={1}
              minWidth={400}
              component="form"
              onSubmit={handleSubmit(handleEditIncome)}
            >

              <TextField
                select
                variant="standard"
                type="text"
                label="Project"
                defaultValue={selectedRow?.project}
                helperText={errors.project && errors.project.message}
                error={Boolean(errors.project)}
                {...register("project", { required: "This field is required" })}
              >
                {projectName.map((option, index) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                variant="standard"
                label="Amount"
                type="number"
                defaultValue={selectedRow?.amount}
                inputProps={{ step: 0.00001 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                helperText={errors.amount && errors.amount.message}
                error={Boolean(errors.amount)}
                {...register("amount", {
                  required: "This field is required",
                })}
              />

              <TextField
                variant="standard"
                label="Description"
                type="text"
                multiline
                rows={3}
                defaultValue={selectedRow?.description}
                error={Boolean(errors.description)}
                helperText={errors.description && errors.description.message}
                {...register("description", {
                  required: "This field is required",
                })}
              />

              <TextField
                select
                variant="standard"
                type="text"
                label="Status"
                defaultValue={selectedRow?.status}
                helperText={errors.status && errors.status.message}
                error={Boolean(errors.status)}
                {...register("status", { required: "This field is required" })}
              >
                {_status.map((option, index) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <Controller
                name="incomeDate"
                control={control}
                defaultValue={dayjs(selectedRow?.incomeDate)}
                render={({ field }) => (
                  <DatePicker
                    label="Date Created"
                    value={field.value}
                    onChange={field.onChange}
                    disableFuture
                    sx={{ mt: 1 }}
                  />
                )}
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
      {selectedRow && (
        <Dialog open={openDeleteDialog} onClose={handleCloseDeletDialog}>
          <DialogTitle>Are you sure to delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              We will delete a selected income permanently.
              <br />
              Please conside to delete this.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleDeleteIncome}>
              Delete
            </Button>
            <Button onClick={handleCloseDeletDialog}>Cancel</Button>
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
            <Typography variant="h5">Income</Typography>
            <Box gap={1} display="flex">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  reset();
                  setOpenCreateDialog(true);
                  inputProjectName(user?.userId);
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
                  inputProjectName(selectedRow?.userId);
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
            sx={{ height: 600, width: "100%" }}
            rows={rows}
            columns={columns}
            getRowId={(params) => params._id}
            slots={{ toolbar: GridToolbar }}
            scrollbarSize={3}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            onRowClick={(params) => setSelectedRow(params.row)}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default IncomePage;
