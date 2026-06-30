/**
 * Prefetch route chunks to load them in the background
 * Call this when hovering over links or on page load for anticipated routes
 */

import { lazy } from "react";

// Map of route paths to their dynamic imports
const routePrefetches = {
  "/login": () => import("../auth/Login"),
  "/signup": () => import("../auth/SignUp"),
  "/dashboard": () => import("../pages/kenz/Dashboard"),
  "/overview": () => import("../pages/kenz/Overview"),
  "/mock-exam": () => import("../pages/kenz/Mockexam"),
  "/profile": () => import("../pages/kenz/Profile"),
  "/past-questions": () => import("../pages/jacob/PastQuestion"),
  "/subscription": () => import("../pages/jacob/Subscription"),
  "/subscription/transactions": () =>
    import("../pages/jacob/TransactionHistory"),
  "/subscription/make-payment": () => import("../pages/jacob/MakePayment"),
};

/**
 * Prefetch a single route
 * @param {string} path - Route path to prefetch
 */
export function prefetchRoute(path) {
  if (routePrefetches[path]) {
    routePrefetches[path](); // Load in background
  }
}

/**
 * Prefetch multiple routes
 * @param {string[]} paths - Array of route paths to prefetch
 */
export function prefetchRoutes(paths) {
  paths.forEach((path) => prefetchRoute(path));
}

/**
 * Prefetch common routes on app load
 * Call this once when app initializes
 */
export function prefetchCommonRoutes() {
  // Prefetch routes users are likely to visit
  prefetchRoutes([
    "/login",
    "/signup",
    "/overview",
    "/mock-exam",
    "/past-questions",
    "/past-questions/view",
    "/profile",
  ]);
}

const RELOAD_FLAG = "__routePrefetchReloaded";

function hasReloadedOnce() {
  try {
    return sessionStorage.getItem(RELOAD_FLAG) === "1";
  } catch {
    return false;
  }
}

function markReloaded() {
  try {
    sessionStorage.setItem(RELOAD_FLAG, "1");
  } catch {
    // ignore storage errors
  }
}

export function safeLazy(importFn) {
  return lazy(() =>
    importFn().catch((error) => {
      console.error("Route chunk failed to load:", error);

      if (typeof window !== "undefined" && !hasReloadedOnce()) {
        markReloaded();
        window.location.reload();
      }

      return {
        default: () => (
          <div>Something went wrong. Please refresh the page.</div>
        ),
      };
    }),
  );
}
