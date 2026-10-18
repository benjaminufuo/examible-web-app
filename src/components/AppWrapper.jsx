import { useEffect } from "react";
import ScrollToTop from "./ScrollToTop";
import PlanEndedModal from "./PlanEndedModal";
import { Outlet } from "react-router-dom";
import { usePageTracking } from "../utils/analytics";
import TagManager from "react-gtm-module";

const AppWrapper = () => {
  usePageTracking();

  useEffect(() => {
    TagManager.initialize({ gtmId: import.meta.env.VITE_GTM_ID });
  }, []);

  return (
    <>
      <ScrollToTop />
      <Outlet />
      <PlanEndedModal />
    </>
  );
};

export default AppWrapper;
