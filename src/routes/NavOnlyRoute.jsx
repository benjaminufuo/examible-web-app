import { useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Blocks direct URL entry to sensitive routes.
 * location.key === "default" only when the page is loaded fresh (typed URL,
 * bookmark, or hard refresh) — any useNavigate() call produces a unique key.
 */
const NavOnlyRoute = ({ children, fallback = "/overview" }) => {
  const location = useLocation();
  const nav = useNavigate();

  useLayoutEffect(() => {
    if (location.key === "default") {
      nav(fallback, { replace: true });
    }
  }, []);

  if (location.key === "default") return null;
  return children;
};

export default NavOnlyRoute;
