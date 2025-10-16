import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/kenz/Home";
import Login from "../src/auth/Login";
import SignUp from "../src/auth/SignUp";
import Welcome from "./auth/welcomeback/Welcome";
import Congratulation from "./auth/welcomeback/Congratulation";
import ForgetPassword from "./auth/ForgetPassword";
import ResetLink from "./auth/ResetLink";
import ResetPassword from "./auth/welcomeback/ResetPassword";
import MainHolder from "./routes/MainHolder";
import Dashboard from "./pages/kenz/Dashboard";
import Overview from "./pages/kenz/Overview";
import Mockexam from "./pages/kenz/Mockexam";
import PastQuestion from "./pages/jacob/PastQuestion";
import Profile from "./pages/kenz/Profile";
import Subscription from "./pages/jacob/Subscription";
import AboutUs from "./pages/jacob/AboutUs";
import Verify from "./auth/Verify";
import ExamBody from "./pages/kenz/ExamBody";
import MakePayment from "./pages/jacob/MakePayment";
import ViewPastQuestion from "./pages/jacob/ViewPastQuestion";
import Callback from "./components/Callback";
import PrivateRoute from "./routes/PrivateRoute";
import VerifyPayment from "./pages/kenz/VerifyPayment";
import MockResult from "./pages/kenz/MockResult";
import Facebookredirect from "./auth/Facebookredirect";
import AppWrapper from "./components/AppWrapper";
import ErrorPgae from "./pages/jacob/ErrorPgae";
import ResultPage from "./pages/jacob/ResultPage";
import Plans from "./pages/jacob/Plans";

const routes = createBrowserRouter([
  {
    element: <AppWrapper />,
    children: [
      { path: "*", element: <ErrorPgae /> },
      {
        path: "",
        element: <MainHolder />,
        children: [
          { path: "", element: <Home /> },
          { path: "about-us", element: <AboutUs /> },
          { path: "plans", element: <Plans /> },
        ],
      },
      { path: "/signup", element: <SignUp /> },
      { path: "/login", element: <Login /> },
      { path: "/welcome", element: <Welcome /> },
      { path: "/congratulation", element: <Congratulation /> },
      { path: "/forgetpassword", element: <ForgetPassword /> },
      { path: "/resetlink", element: <ResetLink /> },
      { path: "/resetpassword/:token", element: <ResetPassword /> },
      { path: "/verify/:token", element: <Verify /> },
      { path: "/callback/:token/:userId", element: <Callback /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "verifyingPayment", element: <VerifyPayment /> },
          {
            element: <Dashboard />,
            children: [
              {
                path: "/dashboard/overview",
                element: <Overview />,
                index: true,
              },
              { path: "/dashboard/mock-exam", element: <Mockexam /> },
              { path: "/dashboard/past-questions", element: <PastQuestion /> },
              { path: "/dashboard/profile", element: <Profile /> },
              { path: "/dashboard/subscription", element: <Subscription /> },
              { path: "/dashboard/make-payment", element: <MakePayment /> },
              { path: "/dashboard/mock-exam/result", element: <MockResult /> },
              {
                path: "/dashboard/past-questions/view",
                element: <ViewPastQuestion />,
              },
              { path: "/dashboard/resultpage", element: <ResultPage /> },
            ],
          },
          { path: "mock-exam/:subjectId", element: <ExamBody /> },
        ],
      },
      { path: "/data-deletion", element: <Facebookredirect /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={routes} />;
};

export default App;
