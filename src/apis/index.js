import axios from "axios";

export const SERVER_URL =
  process.env.REACT_APP_BACKEND_URL;

const jwtInterceoptor = axios.create({});

jwtInterceoptor.interceptors.request.use((config) => {
  let tokensData = JSON.parse(localStorage.getItem("tokens"));
  config.headers.set("Authorization", `bearer ${tokensData.accessToken}`);
  return config;
});

jwtInterceoptor.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    try {
      if (error.response.status === 401) {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const payload = {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };

        let apiResponse = await axios.post(
          `${SERVER_URL}/api/auth/refreshtoken`,
          payload
        );
        localStorage.setItem("tokens", JSON.stringify(apiResponse.data.tokens));
        error.config.headers.set(
          "Authorization",
          `bearer ${apiResponse.data.tokens.accessToken}`
        );
        return axios(error.config);
      } else {
        return Promise.reject(error);
      }
    } catch (e) {
      localStorage.removeItem("tokens");
      window.location.replace(window.location.origin + "/login");
    }
  }
);

const login = (data) => axios.post(`${SERVER_URL}/api/auth/login`, data);
const signup = (data) => axios.post(`${SERVER_URL}/api/auth/signup`, data);
const resetPassword = (data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/auth/reset-password`, data);

const getConstans = () => axios.get(`${SERVER_URL}/api/constants`);

//user crud
const getUsers = () => jwtInterceoptor.get(`${SERVER_URL}/api/user`);
const createUser = (data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/user`, data);
const updateUser = (id, data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/user/${id}`, data);
const deleteUser = (id) =>
  jwtInterceoptor.delete(`${SERVER_URL}/api/user/${id}`);
const getUserIds = () => axios.get(`${SERVER_URL}/api/user/userid`);


//income crud
const getIncomes = () => jwtInterceoptor.get(`${SERVER_URL}/api/income`);
const getIncomesById = (id) =>
  jwtInterceoptor.get(`${SERVER_URL}/api/income/${id}`);
const updateIncome = (id, data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/income/${id}`, data);
const createIncome = (data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/income`, data);
const deleteIncome = (id) =>
  jwtInterceoptor.delete(`${SERVER_URL}/api/income/${id}`);

//account crud
const getAccounts = () => jwtInterceoptor.get(`${SERVER_URL}/api/account`);
const getAccountsById = (id) =>
  jwtInterceoptor.get(`${SERVER_URL}/api/account/${id}`);
const updateAccount = (id, data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/account/${id}`, data);
const createAccount = (data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/account`, data);
const deleteAccount = (id) =>
  jwtInterceoptor.delete(`${SERVER_URL}/api/account/${id}`);

//project crud
const getProjects = () => jwtInterceoptor.get(`${SERVER_URL}/api/project`);
const getProjectsById = (id) =>
  jwtInterceoptor.get(`${SERVER_URL}/api/project/${id}`);
const updateProject = (id, data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/project/${id}`, data);
const createProject = (data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/project`, data);
const deleteProject = (id) =>
  jwtInterceoptor.delete(`${SERVER_URL}/api/project/${id}`);

//expense crud
const getexpenses = () => jwtInterceoptor.get(`${SERVER_URL}/api/expense`);
const updateexpense = (id, data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/expense/${id}`, data);
const createexpense = (data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/expense`, data);
const deleteexpense = (id) =>
  jwtInterceoptor.delete(`${SERVER_URL}/api/expense/${id}`);

const getDashboardData = () =>
  jwtInterceoptor.get(`${SERVER_URL}/api/dashboard`);

const createReport = (data) =>
  jwtInterceoptor.post(`${SERVER_URL}/api/report`, data);

export const apis = {
  login,
  signup,
  getUsers,
  getIncomes,
  getProjects,
  getexpenses,
  getConstans,
  createUser,
  deleteUser,
  updateUser,
  updateIncome,
  updateProject,
  createIncome,
  createProject,
  deleteIncome,
  deleteProject,
  updateexpense,
  createexpense,
  deleteexpense,
  getDashboardData,
  getIncomesById,
  getProjectsById,
  getUserIds,
  resetPassword,
  createAccount,
  getAccounts,
  getAccountsById,
  updateAccount,
  deleteAccount,
  createReport,

};
