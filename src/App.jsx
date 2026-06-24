import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";

const Dashboard = safeLazy(() => import("./pages/kenz/Dashboard"));
const Overview = safeLazy(() => import("./pages/kenz/Overview"));
const Home = safeLazy(() => import("./pages/kenz/Home"));
const Login = safeLazy(() => import("./auth/Login"));
const SignUp = safeLazy(() => import("./auth/SignUp"));
const ForgetPassword = safeLazy(() => import("./auth/ForgetPassword"));
const ResetPassword = safeLazy(
  () => import("./auth/welcomeback/ResetPassword"),
);
const CbtMode = safeLazy(() => import("./pages/kenz/CbtMode"));
const Mockexam = safeLazy(() => import("./pages/kenz/Mockexam"));
const PastQuestion = safeLazy(() => import("./pages/jacob/PastQuestion"));
const Profile = safeLazy(() => import("./pages/kenz/Profile"));
const Subscription = safeLazy(() => import("./pages/jacob/Subscription"));
const TransactionHistory = safeLazy(
  () => import("./pages/jacob/TransactionHistory"),
);
const Verify = safeLazy(() => import("./auth/Verify"));
const ExamBody = safeLazy(() => import("./pages/kenz/ExamBody"));
const MakePayment = safeLazy(() => import("./pages/jacob/MakePayment"));
const ViewPastQuestion = safeLazy(
  () => import("./pages/jacob/ViewPastQuestion"),
);
const PerformanceSummary = safeLazy(
  () => import("./pages/kenz/PerformanceSummary"),
);
// const CbtReport = safeLazy(() => import("./pages/kenz/CbtReport"));
const Callback = safeLazy(() => import("./components/Callback"));
const VerifyPayment = safeLazy(() => import("./pages/kenz/VerifyPayment"));
const MockResult = safeLazy(() => import("./pages/kenz/MockResult"));
const Facebookredirect = safeLazy(() => import("./auth/Facebookredirect"));
const ErrorPgae = safeLazy(() => import("./pages/jacob/ErrorPgae"));
const MainHolder = safeLazy(() => import("./routes/MainHolder"));

// These MUST be eager imports (needed for the layout/routing to work)
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
        element: (
          <Suspense fallback={<Loading />}>
            <MainHolder />
          </Suspense>
        ),
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
              // {
              //   path: "/cbt-mode/report",
              //   element: <CbtReport />,
              // },
              {
                path: "/mock-exam",
                element: <Mockexam />,
              },
              {
                path: "/mock-exam/performance-summary",
                element: <PerformanceSummary />,
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
                path: "/subscription/transactions",
                element: <TransactionHistory />,
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
                path: "/cbt-mode/result",
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
            path: "mock-exam/questions",
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
