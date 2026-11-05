import { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import ScrollToTop from "./ScrollToTop";
import PlanEndedModal from "./PlanEndedModal";
import OfflineBanner from "./OfflineBanner";
import AppUpdater from "./AppUpdater";
import UpdateRequired from "./UpdateRequired";
import { Outlet } from "react-router-dom";
import { setAnalyticsUser, usePageTracking } from "../utils/analytics";
import CookieBanner from "./CookieBanner";
import { loadTagManager } from "../utils/tagManager";

const AppWrapper = () => {
  const user = useSelector((state) => state.user);

  // The one place that keeps the analytics user in sync (login, logout, plan
  // changes). A layout effect: React runs the pages' own effects before this
  // component's, but every layout effect before any normal one, so the
  // student is identified before the first event (page views, and the
  // pages' events such as offline_page_blocked or the install card).
  useLayoutEffect(() => {
    setAnalyticsUser(user?.id ? user : null); // logout resets user to {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.plan]);

  usePageTracking();

  useEffect(() => {
    loadTagManager(import.meta.env.VITE_GTM_ID);
  }, []);

  return (
    <>
      <ScrollToTop />
      <OfflineBanner />
      <AppUpdater />
      <Outlet />
      <PlanEndedModal />
      <UpdateRequired />
      <CookieBanner />
    </>
  );
};

export default AppWrapper;
