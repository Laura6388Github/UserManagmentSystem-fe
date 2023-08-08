import { Box, Button, MenuItem, TextField, Select, Typography, OutlinedInput, FormControl, InputLabel, Switch, FormControlLabel, Stack, Grid } from "@mui/material"
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {_where, account_platform, course, week } from "../constants";
import { apis } from "../apis";
import { Link } from "react-router-dom";
// import { useSnackbar } from "notistack";
// import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";



// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }

const ReportPage = () => {

  // const [selectedRow, setSelectedRow] = React.useState(null);
  const {
    register,
    control,
    handleSubmit,
    // reset,
    // formState: { errors },
  } = useForm();

  const [award, setAward] = useState(false);
  const [pending, setPending] = useState(false);
  const [working, setWorking] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [english, setEnglish] = useState(false);
  const [projectPartner, setProjectPartner] = useState(false);
  const [helpPartner, setHelpPartner] = useState(false);
  const [rule, setRule] = useState(false);
  // const {enqueueSnackbar} =  useSnackbar();
  // const { user } = useSelector((state) => state.auth);
  // const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const handleCreateReport = async (data) => {
     try {
    data.reportDate =data.reportDate.$d;
      
      // console.log("-----------------------------",data);
      await apis.createReport(data);
      // alert(data.reportDate);
      // console.log("-------------------",res);
      // enqueueSnackbar({ variant: "success", message: res.data?.message });
      // <Navigate to={"/report"} />
      navigate("/report");
  //     reset();
  //     // await fetchIncomes();
     } catch (err) {
  //     enqueueSnackbar({
  //       variant: "error",
  //       message: err.response?.data.message || strings.SERVER_ERROR,
  //     });
          navigate("/income");
     }
  }

  
  return (
    <Box sx={{display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', textAlign: 'center' }}>
      <form onSubmit={handleSubmit(handleCreateReport)}>
        <Grid container spacing={2}>
{/* //-------------------------------------------Getting Job------------------------------------------------------------// */}          
          <Grid item xs={12} sm={6}>
            <Typography variant="h3"> Getting Job</Typography>
            <hr></hr>
            <br></br>
            <FormControl>
            <Stack
              direction="column"
              gap={2}
              minWidth={400}
              component="form"
            >
             
              <InputLabel sx={{textAlign:"left"}} id = "jobplatform_label">Where do you work to get a job?</InputLabel>
              <Controller
                name="_where"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Select
                    multiple
                    labelId="jobplatform_label"
                    value={field.value}
                    onChange={field.onChange}
                  >
                  {
                  _where.map((option, index) => (
                    <MenuItem key={option} value={option}> {option}</MenuItem>
                  ))}
                  </Select>
                )}
              />
              <TextField
                multiline
                variant="standard"
                type="text"
                label="Account info(Name,nationality,review,score)"
                rows={4}
                {...register("account_info", {
                  // required: "This field is required",
                })}
              />

              <TextField
                variant="standard"
                type="number"
                label="How many bids are you sent today?"
                {...register("bid_count", {
                  // required: "This field is required",
                })}
              />

              <FormControlLabel
                control={<Switch color="primary" {...register("future_project")} />}
                label="Do yu have projects that client will be back?"
                labelPlacement="start"
              />

              <TextField
                variant="standard"
                type="number"
                label="How many clients relied to your proposal?"
                {...register("reply_count", {
                  // required: "This field is required",
                })}
              />

              <FormControlLabel
                control={<Switch color="primary"  {...register("awarded_project")}  onChange={() => setAward(!award)}/>}
                label="Do you have projects that you have been awarded?"
                labelPlacement="start"
              />

              <FormControlLabel
                control={<Switch color="primary" {...register("discuss_project")} />}
                label="Do you have projects that discussed currently?"
                labelPlacement="start"
              />

              {(!award) && <TextField
                multiline
                variant="standard"
                type="text"
                label="Reason why you get zero reply or project awarded today?"
                rows={4}
                {...register("reason_zero", {
                  // required: "This field is required",
                })}
              />}

            </Stack>
            </FormControl>
          </Grid>
{/* //--------------------------------------------Project Status-----------------------------------------------------------// */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h3"> Project Status</Typography>
            <hr></hr>
            <br></br>
            <FormControl> 

            <Stack
              direction="column"
              gap={2}
              minWidth={400}
              component="form"
            >

              <FormControlLabel
                control={<Switch color="primary"  {...register("pending_project")}  onChange={() => setPending(!pending)}/>}
                label="Have you any pending projects?"
                labelPlacement="start"
              />
              
              {(pending) && <TextField
                multiline
                variant="standard"
                type="text"
                label="What is the reason of pending?"
                rows={4}
                {...register("pending_reason", {
                  // required: "This field is required",
                })}
              />}

              <FormControlLabel
                control={<Switch color="primary"  {...register("working_project")}  onChange={() => setWorking(!working)}/>}
                label="Do you have any working pprojects?"
                labelPlacement="start"
              />
              
              {(working) && <TextField
                multiline
                variant="standard"
                type="text"
                label="Working projects Detail"
                rows={4}
                {...register("working_info", {
                  // required: "This field is required",
                })}
              />}

              <FormControlLabel
                control={<Switch color="primary"  {...register("complete_project")}  onChange={() => setCompleted(!completed)}/>}
                label="Have you completed any projects today?"
                labelPlacement="start"
              />
              
              {(completed) && <TextField
                multiline
                variant="standard"
                type="text"
                label="Experience from completed project"
                rows={4}
                {...register("exp_complete", {
                  // required: "This field is required",
                })}
              />}

              <TextField
                variant="standard"
                type="text"
                label="Income pay method"
                {...register("income_method")}
              />

              <TextField
                variant="standard"
                type="text"
                label="Client name"
                {...register("income_clientname")}
              />

              <TextField
                variant="standard"
                type="text"
                label="Income Amount"
                {...register("income_amount")}
              />

              <TextField
                variant="standard"
                type="text"
                label="Expense reason"
                {...register("expense_reason")}
              />

              <TextField
                variant="standard"
                type="text"
                label="Expense pay method"
                {...register("expense_method")}
              />

              <TextField
                variant="standard"
                type="text"
                label="Expense Amount"
                {...register("expense_amount")}
              />

              </Stack>
            </FormControl>
          </Grid>
{/* //------------------------------------------------Account Hunting && Skill development-------------------------------------------------------// */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h3">Account Hunting && Skill development</Typography>
             
            <hr></hr>
            <br></br>
            <FormControl>
            <Stack
              direction="column"
              gap={2}
              minWidth={400}
              component="form"
            >

              <TextField
                multiline
                variant="standard"
                type="text"
                label="What is your principle to create the account"
                rows={4}
                {...register("principle_account", {
                  // required: "This field is required",
                })}
              />

              <InputLabel>Where do you hike people?</InputLabel>
              <Controller
                name="account_platform"
                control={control}
                defaultValue={[]}
                InputLabel="What is your course?"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    input={<OutlinedInput label="Where do you hike people?" />}
                  >
                  {
                  account_platform.map((option, index) => (
                    <MenuItem key={option} value={option}> {option}</MenuItem>
                  ))}
                  </Select>
                )}
              />

              <TextField
                multiline
                variant="standard"
                type="text"
                label="Why do you select these platform?"
                rows={4}
                {...register("platform_reason", {
                  // required: "This field is required",
                })}
              />

              <TextField
                variant="standard"
                type="number"
                label="How many people have you contact today?"
                {...register("contact_count", {
                  // required: "This field is required",
                })}
              />

              <TextField
                multiline
                variant="standard"
                type="text"
                label="Tips to share with others."
                rows={4}
                {...register("tip_account")}
              />

              <TextField
                variant="standard"
                type="number"
                label="How many people agree with you?"
                {...register("agree_count")}
              />

              <InputLabel id="label_course" >What is your course?</InputLabel>
              <Controller
                name="course_name"
                control={control}
                defaultValue={[]}

                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    input={<OutlinedInput label="What is your course?" />}
                    labelId="label_course"
                  >
                  {
                  course.map((option, index) => (
                    <MenuItem key={option} value={option}> {option}</MenuItem>
                  ))}
                  </Select>
                )}
              />

              <Controller
                name="course_week"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    input={<OutlinedInput label="Which week?" />}
                  >
                  {
                  week.map((option, index) => (
                    <MenuItem key={option} value={option}> {option}</MenuItem>
                  ))}
                  </Select>
                )}
              />

              <FormControlLabel
                control={<Switch color="primary"  {...register("english_study")}  onChange={() => setEnglish(!english)}/>}
                label="Have you studied English today?"
                labelPlacement="start"
              />
              
              {(english) && <TextField
                multiline
                variant="standard"
                type="text"
                label="What is your main goal in English studying?"
                rows={4}
                {...register("main_english", {
                  // required: "This field is required",
                })}
              />}

            </Stack>
            </FormControl>
          </Grid>
{/* //-----------------------------------------Team Work & Experience--------------------------------------------------------------// */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h3">Team Work & Experience</Typography>
            
            <hr></hr>
            <br></br>
            <FormControl> 
            <Stack
              direction="column"
              gap={2}
              minWidth={400}
              component="form"
            >

              <TextField
                variant="standard"
                type="number"
                label="How many times have you had a chance to discuss with pair?"
                {...register("discuss_count", {
                  // required: "This field is required",
                })}
              />

              <FormControlLabel
                control={<Switch color="primary"  {...register("project_partner")}  onChange={() => setProjectPartner(!projectPartner)}/>}
                label="Do you have the projects that you're working with your partner"
                labelPlacement="start"
              />

              {(projectPartner) && <TextField
                multiline
                variant="standard"
                type="text"
                label="Project Detail?"
                rows={4}
                {...register("project_detail", {
                  // required: "This field is required",
                })}
              />}

              <TextField
                select
                variant="standard"
                type="number"
                label="Status"
                {...register("partnership_like", { 
                  // required: "This field is required" 
                })}
              >
                    <MenuItem key={1} value={1}>1</MenuItem>
                    <MenuItem key={2} value={2}>2</MenuItem>
                    <MenuItem key={3} value={3}>3</MenuItem>
                    <MenuItem key={4} value={4}>4</MenuItem>
                    <MenuItem key={5} value={5}>5</MenuItem>
              </TextField>

              <FormControlLabel
                control={<Switch color="primary"  {...register("help_partner")} onChange={() => setHelpPartner(helpPartner)} />}
                label="Have you had thankful help or active tips from partner?"
                labelPlacement="start"
              />

              <TextField
                select
                variant="standard"
                type="number"
                label="Status"
                {...register("partnership_dislike", { 
                  required: "This field is required" 
                })}
              >
                    <MenuItem key={1} value={1}>1</MenuItem>
                    <MenuItem key={2} value={2}>2</MenuItem>
                    <MenuItem key={3} value={3}>3</MenuItem>
                    <MenuItem key={4} value={4}>4</MenuItem>
                    <MenuItem key={5} value={5}>5</MenuItem>
              </TextField>

              <TextField
                variant="standard"
                type="number"
                label="How many hours do you work?"
                {...register("work_time", {
                  required: "This field is required",
                })}
              />

              <TextField
                variant="standard"
                type="number"
                label="How many hours do you sleep?"
                {...register("sleep_time", {
                  required: "This field is required",
                })}
              />

              <FormControlLabel
                control={<Switch color="primary"  {...register("rule_internet")}  onChange={() => setRule(!rule)}/>}
                label="Have you any problem in Internet?"
                labelPlacement="start"
              />

              {(rule) && <TextField
                multiline
                variant="standard"
                type="text"
                label="What problem happens?"
                rows={4}
                {...register("problem_internet", {
                  required: "This field is required",
                })}
              />}

              <Controller
                name="reportDate"
                control={control}
                defaultValue={dayjs(Date.now())}
                render={({ field }) => (
                  <DatePicker
                    label="Select Date"
                    value={field.value}
                    onChange={field.onChange}
                    disableFuture
                    sx={{ mt: 1 }}
                  />
                )}
              />

              </Stack>
            </FormControl>
          </Grid>

        </Grid>
        <Button variant="contained" type="submit">Next</Button>
        <Button component={Link} to="/report">Cancel</Button>
        {/* </Stack> */}
      </form>
    </Box>
    
  )
}

export default ReportPage;