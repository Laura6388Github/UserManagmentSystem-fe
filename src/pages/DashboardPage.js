import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Menu,
  Stack,
  Typography,
  useTheme,
  MenuItem,
  styled,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChartByTeam from "../components/ChartByTeam";
import VerifiedIcon from "@mui/icons-material/Verified";
import InsightsIcon from "@mui/icons-material/Insights";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useSelector } from "react-redux";
import Carousel from "react-material-ui-carousel";
import ChartByCompany from "../components/ChartByCompany";
import { apis } from "../apis";
import { socket } from "../apis/socket";
import { toCapitalize } from "../utils/toCapitalize";
import Paper from "@mui/material/Paper";

const infos = [
  {
    headerTitle: "Total",
    fontColor: "#2196f3",
    type: "income",
    title: "USD",
    description: ":",
    descCount: 2,
    bg: "rgb(74 163 233 / 20%)",
  },
  {
    headerTitle: "Target",
    fontColor: "#ffc107",
    type: "target",
    title: "USD",
    description: "Yesterday's overdue:",
    descCount: 2,
    bg: "rgb(255 193 7 / 20%)",
  },
  {
    headerTitle: "Best Team",
    fontColor: "#f44336",
    type: "top",
    title: "",
    description: "Yesterday's overdue:",
    descCount: 2,
    bg: "rgb(246 95 84 / 20%)",
  },
  {
    headerTitle: "Projects",
    fontColor: "#4caf50",
    type: "project",
    title: "",
    description: "Yesterday's overdue:",
    descCount: 2,
    bg: "rgb(46 125 50 / 20%)",
  },
  {
    headerTitle: "Potential",
    fontColor: "#2196f3",
    type: "potential",
    title: "USD",
    description: "Yesterday's overdue:",
    descCount: 2,
    bg: "rgb(74 163 233 / 30%)",
  },
  {
    headerTitle: "Rate",
    fontColor: "#ffc107",
    type: "rate",
    title: "%",
    description: "Yesterday's overdue:",
    descCount: 2,
    bg: "rgb(255 193 7 / 30%)",
  },
  {
    headerTitle: "Weakest Team",
    fontColor: "#f44336",
    type: "last",
    title: "",
    description: "Yesterday's overdue:",
    descCount: 2,
    bg: "rgb(246 95 84 / 30%)",
  },
  {
    headerTitle: "Accounts",
    fontColor: "#4caf50",
    type: "account",
    title: "",
    description: "Yesterday's overdue:",
    descCount: 2,
    bg: "rgb(46 125 50 / 30%)",
  },
];

const StyledCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  boxShadow: "none",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxHeight: "405px",
  overflowY: "hidden",
  padding: theme.spacing(2),
  "& .content": {
    WebkitAnimation: "scroll 20s cubic-bezier(0.4, 0, 0.2, 1) infinite",
  },
  "@keyframes scroll": {
    "0%": { transform: "translateY(0)" },
    "100%": { transform: "translateY(calc(-100% + 390px))" },
  },
}));

const DashBoardPage = () => {
  const theme = useTheme();
  const { teams } = useSelector((state) => state.common);
  const [topData, setTopData] = useState({
    income: 0,
    expense: 0,
    target: 0,
    potential: 0,
    rate: 0,
    project: 0,
    account: 0,
    top: 0,
    topTotal: 0,
    last: 0,
    lastTotal: 0,
  });
  const [membersRanked, setMemberRanked] = useState([]);
  const [teamsInfo, setTeamsInfo] = useState(null);
  const [selectedTeamData, setSelectedTeamData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chartByTeamInfo, setChartByTeamInfo] = useState([]);
  const [chartByUserInfo, setChartByUserInfo] = useState([]);
  const openTeamMenu = Boolean(anchorEl);
  const [chartName, setChartName] = useState("");

  const handleSelectTeam = (e) => {
    var teamId = e._id;
    var tempData = teamsInfo.filter((item) => item?.team === teamId)[0];
    setSelectedTeamData(tempData);
    setAnchorEl(null);
  };

  const handleOpenTeamMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSlideChange = (key) => {
    if (key === 0) setChartName("Income by team");
    else setChartName(teams[key - 1]?.name);
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await apis.getDashboardData();
      var data = res.data.data;
      setChartByUserInfo(data.userAnalysis);
      setChartByTeamInfo(data.analysis);
      setTeamsInfo(data.analysis);
      setSelectedTeamData(data.currentTeamInfo);
      setTopData(data.topData);
      setMemberRanked(data?.membersRanked);
    } catch (err) {
      // enqueueSnackbar({ variant: "error", message: err.response?.data?.message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const onUpdate = (e) => {
      fetchData();
    };
    socket.on("update_dashboard", onUpdate);
    return () => {
      socket.off("update_dashboard", onUpdate);
    };
  }, [fetchData]);

  useEffect(() => {}, []);

  return (
    <Box>
      <Menu
        anchorEl={anchorEl}
        open={openTeamMenu}
        onClick={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {teams.map((option, index) => (
          <MenuItem
            key={option._id}
            onClick={() => {
              handleSelectTeam(option);
            }}
            disableRipple
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
      <Grid direction="row" container spacing={2}>
        <Grid item xs={12} lg={9}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12}>
              <Grid container direction="row" spacing={2}>
                {infos.map((info, index) => {
                  return (
                    <Grid item xs={6} sm={6} md={3} key={index}>
                      <Card sx={{ bgcolor: info.bg }}>
                        <CardHeader
                          title={
                            <Typography variant="h5">
                              {info.headerTitle}
                            </Typography>
                          }
                          action={
                            <IconButton aria-label="settings">
                              <MoreVertIcon />
                            </IconButton>
                          }
                        ></CardHeader>
                        <CardContent sx={{ padding: 0 }}>
                          <Box
                            display="flex"
                            direction="row"
                            justifyContent="center"
                            alignItems="baseline"
                          >
                            <Box
                              sx={{
                                color: info.fontColor,
                                fontSize: "2.5rem",
                                fontWeight: "bold",
                                overflow: "hidden",
                              }}
                            >
                              {info.type == 'rate' ? topData[info.type].toFixed(2) : Math.round(
                                    topData[info.type]
                                  ).toLocaleString()}
                            </Box>
                            <Box
                              sx={{
                                color: info.fontColor,
                                fontWeight: "medium",
                                fontSize: "1.3rem",
                                marginLeft: 1 / 2,
                              }}
                            >
                              {info.title}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title={<Typography variant="h5">{chartName}</Typography>}
                  avatar={
                    <InsightsIcon sx={{ color: theme.palette.primary.main }} />
                  }
                />

                <CardContent>
                  <Carousel
                    autoPlay
                    animation="slide"
                    duration={1000}
                    indicators
                    sx={{ width: "100%", height: "100%" }}
                    onChange={handleSlideChange}
                  >
                    <ChartByCompany data={chartByTeamInfo} />
                    <ChartByTeam data={chartByUserInfo[0]} />
                    <ChartByTeam data={chartByUserInfo[1]} />
                    <ChartByTeam data={chartByUserInfo[2]} />
                    <ChartByTeam data={chartByUserInfo[3]} />
                    <ChartByTeam data={chartByUserInfo[4]} />
                  </Carousel>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title={
                    <Typography variant="h5">
                      {selectedTeamData?.name}
                    </Typography>
                  }
                  subheader="Analysis"
                  avatar={
                    <PeopleAltIcon sx={{ color: theme.palette.primary.main }} />
                  }
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={handleOpenTeamMenu}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <StyledCard>
                        <CardContent>
                          <Typography
                            sx={{
                              fontSize: "2rem",
                              fontWeight: "bold",
                            }}
                          >
                            $
                            {selectedTeamData
                              ? Math.round(
                                  selectedTeamData?.income
                                ).toLocaleString()
                              : "0"}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "medium",
                              fontSize: "1rem",
                            }}
                          >
                            Total
                          </Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledCard>
                        <CardContent>
                          <Typography
                            sx={{
                              color: "#2e7d32",
                              fontSize: "2rem",
                              fontWeight: "bold",
                              overflow: "hidden",
                            }}
                          >
                            {selectedTeamData
                              ? (
                                  (parseFloat(selectedTeamData?.income) /
                                    selectedTeamData?.target) *
                                  100
                                ).toFixed(2)
                              : "0"}{" "}
                            %
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "medium",
                              fontSize: "1rem",
                            }}
                          >
                            Percentage
                          </Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>

                    <Grid item xs={6}>
                      <StyledCard>
                        <CardContent>
                          <Typography
                            sx={{
                              fontSize: "1.3rem",
                              fontWeight: "bold",
                            }}
                          >
                            {selectedTeamData
                              ? Math.round(
                                  selectedTeamData?.project
                                ).toLocaleString()
                              : "0"}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "medium",
                              fontSize: "1rem",
                            }}
                          >
                            Projects
                          </Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledCard>
                        <CardContent>
                          <Typography
                            sx={{
                              fontSize: "1.3rem",
                              fontWeight: "bold",
                            }}
                          >
                            $
                            {selectedTeamData
                              ? Math.round(
                                  selectedTeamData?.potential
                                ).toLocaleString()
                              : "0"}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "medium",
                              fontSize: "1rem",
                            }}
                          >
                            Potential
                          </Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledCard>
                        <CardContent>
                          <Typography
                            sx={{
                              fontSize: "1.3rem",
                              fontWeight: "bold",
                            }}
                          >
                            ${selectedTeamData?.target.toLocaleString()}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "medium",
                              fontSize: "1rem",
                            }}
                          >
                            Target
                          </Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledCard>
                        <CardContent>
                          <Typography
                            sx={{
                              fontSize: "1.3rem",
                              fontWeight: "bold",
                            }}
                          >
                            {selectedTeamData
                              ? Math.round(
                                  selectedTeamData?.rank
                                ).toLocaleString()
                              : "0"}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "medium",
                              fontSize: "1rem",
                            }}
                          >
                            Rank
                          </Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} lg={12}>
              <Card>
                <CardHeader
                  title={<Typography variant="h5">Rank</Typography>}
                  avatar={
                    <VerifiedIcon sx={{ color: theme.palette.success.main }} />
                  }
                />
                <CardContent sx={{ py: 0 }}>
                  <StyledPaper>
                    <Box className="content">
                      {membersRanked?.map((member, index) => (
                        <Stack
                          direction="row"
                          spacing={3}
                          key={`top-member-${index}`}
                        >
                          <Grid
                            container
                            sx={{
                              borderBottom: "1px dashed rgb(226, 232, 240)",
                            }}
                            py={0.5}
                            px={1}
                          >
                            <Grid item xs={2}>
                              <Typography
                                fontWeight={500}
                                sx={{
                                  fontSize: "1.2rem",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {index + 1}
                              </Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <Typography
                                fontWeight={500}
                                sx={{
                                  fontSize: "1.2rem",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {toCapitalize(member.name)}
                              </Typography>
                            </Grid>
                            <Grid item xs={5} sx={{ textAlign: "right" }}>
                              <Typography
                                fontWeight={500}
                                sx={{
                                  fontSize: "1.2rem",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                $ {parseFloat(member?.income).toLocaleString()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Stack>
                      ))}
                    </Box>
                  </StyledPaper>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashBoardPage;
