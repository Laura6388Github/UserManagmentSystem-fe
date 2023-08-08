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
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  _contractType,
  _projectStatus,
  _countries,
  _skill,
  _worker,
  _where,
} from "../constants"

import Paper from '@mui/material/Paper';

import { useEffect, useState } from "react";
import { apis } from "../apis";
import { useSnackbar } from "notistack";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";

import { strings } from "../constants/strings";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSelector } from "react-redux";

import dayjs from "dayjs";

const ProjectPage = () => {
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

  const [budgetType, setBudgetType] = useState(_contractType[0]);
  const [incomeInfo, setIncomeInfo] = useState([]);
  const [incomeTable, setIncomeTable] = useState([])
  const [skill, setSkill] = useState([]);
  const [workWith, setWorkWith] = useState([]);
  const [defaultCountry, setDefaultCountry] = useState(null);
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
    // { field: "userId", headerName: "User ID" },
    { field: "fullname", headerName: "Name" },
    // {
    //   field: "company",
    //   headerName: "Company",
    //   type: "Object",
    //   valueFormatter: (params) => getCompanyName(params.value),
    // },
    // {
    //   field: "office",
    //   headerName: "Office",
    //   type: "Object",
    //   valueFormatter: (params) => getOfficeName(params.value),
    // },
    {
      field: "team",
      headerName: "Team",
      type: "Object",
      valueFormatter: (params) => getTeamName(params.value),
    },
    {
      field: "clientName",
      headerName: "Client Name",
      type: "string",
    },
    {
      field: "country",
      headerName: "Country",
      type: "string",
    },
    {
      field: "projectName",
      headerName: "Project Name",
      type: "string",
    },
    {
      field: "contractType",
      headerName: "Contract Type",
      type: "string",
    },
    {
      field: "skill",
      headerName: "Skill",
      type: "string",
    },
    {
      field: "budget",
      headerName: "Budget",
      type: "number",
    },
    {
      field: "status",
      headerName: "Status",
      type: "string",
    },
    {
      field: "potential",
      headerName: "Potential",
      type: "number",
    },
    {
      field: "workWith",
      headerName: "Work With",
      type: "string",
    },
    {
      field: "where",
      headerName: "Where",
      type: "string",
    },
    {
      field: "account",
      headerName: "Account",
      type: "string",
    },
    
    {
      field: "createdAt",
      headerName: "CreatedAt",
      type: "date",
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "deadline",
      headerName: "Deadline",
      type: "date",
      valueGetter: (params) => new Date(params.value),
    },
  ];
  const handleCreateProject = async (data) => {
    if (isLoading) return;
    Object.assign(data, {skill:skill});
    Object.assign(data, { workWith: workWith });
   
    try {
      data.projectDate = new Date(data.projectDate.$d);
      await apis.createProject(data);
      setOpenCreateDialog(false);
      reset();
      await fetchProjects();
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: err.response?.data.message || strings.SERVER_ERROR,
      });
    }
    setSkill([]);
    setWorkWith([]);

  };
  const handleCloseCreateDialog = () => {
    reset();
    setOpenCreateDialog(false);
  };

  const handleEditProject = async (data) => {
    if (isLoading) return;

    Object.assign(data, {skill:skill});
    Object.assign(data, { workWith: workWith });

    try {
      data.projectDate = data.projectDate.$d.toISOString();
      data.updatedAt = new Date();
      await apis.updateProject(selectedRow._id, data);
      setSelectedRow(null);
      setOpenEditDialog(false);
      reset();
      await fetchProjects();
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

  const handleDeleteProject = async () => {
    if (isLoading) return;
    try {
      await apis.deleteProject(selectedRow._id);
      setSelectedRow(null);
      setOpenDeleteDialog(false);
      await fetchProjects();
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

  const fetchProjects = React.useCallback(async () => {
    try {
      const res = await apis.getProjects();
      setRows(res.data.projects.projects);
      setIncomeInfo(res.data.projects.incomeInfo);
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        type: err.response.data.message || strings.SERVER_ERROR,
      });
    }
  }, [user, enqueueSnackbar]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, user]);


  const selectSkill = (event, value) =>{
    setSkill((e)=>value);
  }

  const selectWorker = (event, worker) => {
    setWorkWith(worker);
  }

  const inputIncome = (user, projectName) => {
    var array = [];
    incomeInfo.forEach((e)=>{
      if(e.project === projectName && e.userId === user){
        array.push(e);
      }
    })
    setIncomeTable(array);
  }

  const changeBudgetType = (e) => {
    setBudgetType(e);
  }

  return (
    <Box>
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Add a new project</DialogTitle>
        <DialogContent>
          <Stack
            direction="column"
            gap={2}
            minWidth={400}
            component="form"
            onSubmit={handleSubmit(handleCreateProject)}
          >
            <TextField
              variant="standard"
              label="ClientName"
              type="text"
              rows={3}
              error={Boolean(errors.clientName)}
              helperText={errors.clientName && errors.clientName?.message}
              {...register("clientName", {
                required: "This field is required",
              })}
            />

            <Autocomplete
              id="createCountrySelect"
              sx={{}}
              options={_countries}
              autoHighlight
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Country"
                  
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                  {...register("country", {
                    required: "This field is required"
                  })}
                />
              )}
            />

            <TextField
              variant="standard"
              label="ProjectName"
              type="text"
              multiline
              error={Boolean(errors.projectName)}
              helperText={errors.projectName && errors.projectName.message}
              {...register("projectName", {
                required: "This field is required",
              })}
            />

            <TextField
              select
              variant="standard"
              type="text"
              label="ContractType"
              defaultValue={_contractType[0]}
              helperText={errors.contractType && errors.contractType.message}
              error={Boolean(errors.contractType)}
              {...register("contractType", { required: "This field is required" })}
            >
              {_contractType.map((option, index) => (
                <MenuItem key={option} value={option} onClick={() => { return (setBudgetType(option)); }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Autocomplete
              multiple
              id="selectSkill"
              label="Skill"
              options={_skill}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              onChange={selectSkill}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  {...params}
                  label="Selecte skills"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  }}          
                />
              )}
            />

            <TextField
              variant="standard"
              label="Budget"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {budgetType === 'Fixed'?'$':'$ per '+budgetType}
                  </InputAdornment>
                ),
              }}
              inputProps={{ step: 1 }}
              helperText={errors.budget && errors.budget.message}
              error={Boolean(errors.budget)}
              {...register("budget", {
                required: "This field is required",
              })}
            />



            <TextField
              select
              variant="standard"
              type="text"
              label="Status"
              defaultValue={_projectStatus[0]}
              helperText={errors.projectStatus && errors.projectStatus.message}
              error={Boolean(errors.projectStatus)}
              {...register("status", { required: "This field is required" })}
            >
              {_projectStatus.map((option, index) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              variant="standard"
              label="Potential (this month)"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">$</InputAdornment>
                ),
              }}
              helperText={errors.potential && errors.potential.message}
              error={Boolean(errors.income)}
              {...register("potential", {
                required: "This field is required",
              })}
            />

            <Autocomplete
              multiple
              id="selectWorker"
              label="WorkWIth"
              options={_worker}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              onChange={selectWorker}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  {...params}
                  label="Work With"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  }}
                />
              )}
            />

            <TextField
              select
              variant="standard"
              type="text"
              label="Where"
              defaultValue={_where[0]}
              helperText={errors.where && errors.where.message}
              error={Boolean(errors.where)}
              {...register("where", { required: "This field is required" })}
            >
              {_where.map((option, index) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              variant="standard"
              label="Account"
              type="text"
              multiline
              error={Boolean(errors.account)}
              helperText={errors.account && errors.account.message}
              {...register("account", {
                required: "This field is required",
              })}
            />

            <Controller
              name="projectDate"
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

            <Controller
              name="deadline"
              control={control}
              defaultValue={dayjs(Date.now())}
              render={({ field }) => (
                <DatePicker
                  label="Deadline"
                  value={field.value}
                  onChange={field.onChange}
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
          <DialogTitle>Edit Project</DialogTitle>
          <DialogContent>
            <Stack
              direction="column"
              gap={1}
              minWidth={400}
              component="form"
              onSubmit={handleSubmit(handleEditProject)}
            >

              <TextField
                variant="standard"
                label="ClientName"
                type="text"
                multiline
                defaultValue={selectedRow?.clientName}
                error={Boolean(errors.clientName)}
                helperText={errors.clientName && errors.clientName.message}
                {...register("clientName", {
                  required: "This field is required",
                })}
              />

              <Autocomplete
                id="editCountrySelect"
                options={_countries}
                autoHighlight
                defaultValue={defaultCountry}     
                helperText={errors.status && errors.status.message}
                error={Boolean(errors.status)}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    label="Choose a country"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    {...register("country", {
                      required: "This field is required"
                    })}
                  />
                )}
              />

              <TextField
                variant="standard"
                label="ProjectName"
                type="text"
                multiline
                defaultValue={selectedRow?.projectName}
                error={Boolean(errors.projectName)}
                helperText={errors.projectName && errors.projectName.message}
                {...register("projectName", {
                  required: "This field is required",
                })}
              />

              <TextField
                select
                variant="standard"
                type="text"
                label="ContractType"
                defaultValue={selectedRow?.contractType}
                helperText={errors.contractType && errors.contractType.message}
                error={Boolean(errors.contractType)}
                {...register("contractType", { required: "This field is required" })}
              >
                {_contractType.map((option, index) => (
                  <MenuItem key={option} value={option} onClick={() => { return (setBudgetType(option)); }}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                multiple
                id="selectSkill"
                label="Skill"
                options={_skill}
                defaultValue={selectedRow?.skill}
                getOptionLabel={(option) => option}
                filterSelectedOptions
                onChange={selectSkill}
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    label="Selecte skills"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}          
                  />
                )}
              />

              <TextField
                variant="standard"
                label="Budget"
                type="number"
                defaultValue={selectedRow?.budget}
                inputProps={{ step: 0.00001 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {budgetType === 'Fixed'?'$':'$ per '+budgetType}  
                    </InputAdornment>
                  ),
                }}
                helperText={errors.budget && errors.budget.message}
                error={Boolean(errors.budget)}
                {...register("budget", {
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
                {_projectStatus.map((option, index) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                variant="standard"
                label="Potential (this month)"
                type="number"
                defaultValue={selectedRow?.potential}
                inputProps={{ step: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
                helperText={errors.potential && errors.potential.message}
                error={Boolean(errors.potential)}
                {...register("potential", {
                  required: "This field is required",
                })}
              />

              <Autocomplete
                multiple
                id="selectWorker"
                label="WorkWIth"
                options={_worker}
                getOptionLabel={(option) => option}
                filterSelectedOptions
                defaultValue={selectedRow?.workWith}
                onChange={selectWorker}
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    label="Work With"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                )}
              />
              

              <TextField
                select
                variant="standard"
                type="text"
                label="Where"
                defaultValue={selectedRow?.where}
                helperText={errors.where && errors.where.message}
                error={Boolean(errors.where)}
                {...register("where", { required: "This field is required" })}
              >
                {_where.map((option, index) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                variant="standard"
                label="Account"
                type="text"
                multiline
                defaultValue={selectedRow?.account}
                error={Boolean(errors.account)}
                helperText={errors.account && errors.account.message}
                {...register("account", {
                  required: "This field is required",
                })}
              />
              
              <Controller
                name="projectDate"
                control={control}
                defaultValue={dayjs(selectedRow?.projectDate)}
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

              <Controller
                name="deadline"
                control={control}
                defaultValue={dayjs(selectedRow?.deadline)}
                render={({ field }) => (
                  <DatePicker
                    label="Deadline"
                    value={field.value}
                    onChange={field.onChange}
                    sx={{ mt: 1 }}
                  />
                )}
              />

              <TableContainer component={Paper}>
                <Table sx={{ width: '100%' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Amount</TableCell>
                      <TableCell align="right">CreatedAt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incomeTable.map((row) => (
                      <TableRow
                        key={row.amount}
                      >
                        <TableCell component="th" scope="row">
                          {row.amount}
                        </TableCell>
                        <TableCell align="right">{row.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

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
              We will delete a selected project permanently.
              <br />
              Please conside to delete this.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleDeleteProject}>
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
            <Typography variant="h5">Project</Typography>
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
                  setSkill(selectedRow?.skill)
                  setWorkWith(selectedRow?.workWith)
                  setDefaultCountry(selectedRow?.country)
                  changeBudgetType(selectedRow?.contractType)
                  inputIncome(selectedRow?.userId, selectedRow?.projectName);

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

export default ProjectPage;
