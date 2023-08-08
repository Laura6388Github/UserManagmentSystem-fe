import { Navigate, createBrowserRouter } from "react-router-dom";
import PrivateLayout from "../layout/PrivateLayout";
import DashBoardPage from "../pages/DashboardPage";
import IncomePage from "../pages/IncomePage";
import ReportPage from "../pages/ReportPage";
import SkillUpPage from "../pages/SkillUpPage";
import PublicLayout from "../layout/PublicLayout";
import SignUpPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminPage from "../pages/AdminPage";
import ProfilePage from "../pages/ProfilePage";
import SharePage from "../pages/SharePage";
import AccountsPage from "../pages/AccountsPage";
import ProjectPage from "../pages/ProjectPage";
import CreateReport from "../pages/CreateReport";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <PrivateLayout children={<Navigate to="/login" />} />,
  },
  {
    path: "/profile",
    element: <PrivateLayout children={<ProfilePage />} />,
  },
  {
    path: "/dashboard",
    element: <PrivateLayout children={<DashBoardPage />} />,
  },
  {
    path: "/income",
    element: <PrivateLayout children={<IncomePage />} />,
  },
  {
    path: "/skill-up",
    element: <PrivateLayout children={<SkillUpPage />} />,
  },
  {
    path: "/report",
    element: <PrivateLayout children={<ReportPage />} />,
  },
  
  {
    path: "/createReport",
    element: <PrivateLayout children={<CreateReport />} />
  },
  {
    path: "/share",
    element: <PrivateLayout children={<SharePage />} />,
  },
  {
    path: "/project",
    element: <PrivateLayout children={<ProjectPage />} />,
  },
  {
    path: "/admin",
    element: <PrivateLayout children={<AdminPage />} />,
  },
  {
    path: "/account",
    element: <PrivateLayout children={<AccountsPage />} />,
  },
  {
    path: "/login",
    element: <PublicLayout children={<LoginPage />} />,
  },
  {
    path: "/signup",
    element: <PublicLayout children={<SignUpPage />} />,
  },
  {
    path: "*",
    element: <PublicLayout children={<NotFoundPage />} />,
  },
]);
