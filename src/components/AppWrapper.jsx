import ScrollToTop from "./ScrollToTop";
import { Outlet } from "react-router-dom";
import { usePageTracking } from "../utils/analytics";

const AppWrapper = () => {
  usePageTracking();
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default AppWrapper;
