import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";

const Dashboard = safeLazy(() => import("./pages/kenz/Dashboard"));
const Overview = safeLazy(() => import("./pages/kenz/Overview"));
const Home = safeLazy(() => import("./pages/kenz/Home"));
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ForgetPassword from "./auth/ForgetPassword";
const ResetLink = safeLazy(() => import("./auth/ResetLink"));
const ResetPassword = safeLazy(
  () => import("./auth/welcomeback/ResetPassword"),
);
const CbtMode = safeLazy(() => import("./pages/kenz/CbtMode"));
const Mockexam = safeLazy(() => import("./pages/kenz/Mockexam"));
const PastQuestion = safeLazy(() => import("./pages/jacob/PastQuestion"));
const Profile = safeLazy(() => import("./pages/kenz/Profile"));
const Subscription = safeLazy(() => import("./pages/jacob/Subscription"));
const Verify = safeLazy(() => import("./auth/Verify"));
const ExamBody = safeLazy(() => import("./pages/kenz/ExamBody"));
const MakePayment = safeLazy(() => import("./pages/jacob/MakePayment"));
const ViewPastQuestion = safeLazy(
  () => import("./pages/jacob/ViewPastQuestion"),
);
const Callback = safeLazy(() => import("./components/Callback"));
const VerifyPayment = safeLazy(() => import("./pages/kenz/VerifyPayment"));
const MockResult = safeLazy(() => import("./pages/kenz/MockResult"));
const Facebookredirect = safeLazy(() => import("./auth/Facebookredirect"));
const ErrorPgae = safeLazy(() => import("./pages/jacob/ErrorPgae"));
const ResultPage = safeLazy(() => import("./pages/jacob/ResultPage"));

// These MUST be eager imports (needed for the layout/routing to work)
import MainHolder from "./routes/MainHolder";
import PrivateRoute from "./routes/PrivateRoute";
import AppWrapper from "./components/AppWrapper";
import InvisibleFallback from "./components/InvisibleFallback";
import { prefetchCommonRoutes, safeLazy } from "./utils/routePrefetch";
import Loading from "./components/Loading";
import GenericError from "./components/GenericError";
import { GlobalErrorBoundary } from "./utils";
import ThemeToggle from "./components/ThemeToggle";

// Prefetch common routes on app load
prefetchCommonRoutes();

const routes = createBrowserRouter([
  {
    element: <AppWrapper />,
    errorElement: <GenericError />,
    children: [
      {
        path: "",
        element: <MainHolder />,
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <Home />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgetpassword",
        element: <ForgetPassword />,
      },
      {
        path: "/resetlink",
        element: (
          <Suspense fallback={<Loading />}>
            <ResetLink />
          </Suspense>
        ),
      },
      {
        path: "/reset-password/:token",
        element: (
          <Suspense fallback={<Loading />}>
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "/verify/:token",
        element: (
          <Suspense fallback={<Loading />}>
            <Verify />
          </Suspense>
        ),
      },
      {
        path: "/callback/:token/:userId",
        element: (
          <Suspense fallback={<Loading />}>
            <Callback />
          </Suspense>
        ),
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/verifying-payment",
            element: <VerifyPayment />,
          },
          {
            element: <Dashboard />,
            children: [
              {
                path: "/overview",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Overview />
                  </Suspense>
                ),
              },
              {
                path: "/mock-exam",
                element: <Mockexam />,
              },
              // JAMB CBT Simulator Route
              {
                path: "/cbt-mode",
                element: <CbtMode />,
              },
              {
                path: "/past-questions",
                element: <PastQuestion />,
              },
              {
                path: "/profile",
                element: <Profile />,
              },
              {
                path: "/subscription",
                element: <Subscription />,
              },
              {
                path: "/subscription/make-payment",
                element: <MakePayment />,
              },
              {
                path: "/mock-exam/result",
                element: <MockResult />,
              },
              {
                path: "/past-questions/view",
                element: <ViewPastQuestion />,
              },
              {
                path: "/past-questions/result",
                element: <MockResult />,
              },
            ],
          },
          {
            path: "mock-exam/:subjectId",
            element: <ExamBody />,
          },
        ],
      },
      {
        path: "/data-deletion",
        element: <Facebookredirect />,
      },
      { path: "*", element: <ErrorPgae /> },
    ],
  },
]);

const App = () => {
  return (
    <GlobalErrorBoundary>
      <Suspense fallback={<InvisibleFallback />}>
        <RouterProvider router={routes} />
      </Suspense>
    </GlobalErrorBoundary>
  );
};

export default App;
