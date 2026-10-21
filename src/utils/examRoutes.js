// One list of exam routes for every check (app updates, the plan pop-up, and
// later the tab bar). Both mock exams and CBT run on /mock-exam/questions today
// (CbtMode.jsx and MockConfigModal.jsx navigate there). Add any future exam
// route (e.g. /cbt-mode/questions) here.
export const EXAM_ROUTES = ["/mock-exam/questions"];

export const isExamRoute = (pathname) =>
  EXAM_ROUTES.some((route) => pathname.startsWith(route));

// Pages that keep nothing in location.state, so reloading loses nothing.
// Not here on purpose: exams, result pages, /past-questions/view,
// /subscription/make-payment and /verifying-payment (all rely on NavOnlyRoute or
// location data), and /login (it reads location.state.selectedPlan from Pricing).
const SAFE_TO_RELOAD = [
  "/",
  "/overview",
  "/past-questions",
  "/mock-exam",
  "/mock-exam/performance-summary",
  "/cbt-mode",
  "/profile",
  "/subscription",
  "/subscription/transactions",
  "/signup",
  "/forgetpassword",
  "/privacy-policy",
  "/terms-of-service",
];

export const isSafeToReload = (pathname) =>
  SAFE_TO_RELOAD.includes(pathname.replace(/\/$/, "") || "/");
