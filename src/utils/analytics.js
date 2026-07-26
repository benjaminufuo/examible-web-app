export const getGAClientId = () => {
  const match = document.cookie.match(/_ga=GA\d\.\d\.(\d+\.\d+)/);
  return match ? match[1] : "";
};

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import TagManager from "react-gtm-module";

export const usePageTracking = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: { event: "page_view", page_path: pathname },
    });
  }, [pathname]);
};
