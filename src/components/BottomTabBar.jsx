import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setMockExamQuestion } from "../global/slice";
import { TABS } from "../constants/appTabs";
import "../styles/bottomTabBar.css";

// A text field has focus, so the on-screen keyboard is (most likely) open
const isTyping = () => {
  const el = document.activeElement;
  if (!el) return false;
  if (el.isContentEditable || el.tagName === "TEXTAREA") return true;
  if (el.tagName !== "INPUT") return false;
  return !["checkbox", "radio", "button", "submit", "range", "file"].includes(
    el.type,
  );
};

// Installed app on phones and tablets: the five main pages, one tap each
// (decision D9). A floating, rounded bar; the highlight behind the current tab
// slides to the next one (still, with the device's "reduce motion" setting). Replaces the sidebar and the menu drawer there; a desktop
// install keeps the sidebar (the CSS only shows this up to 850px). Hidden
// while the keyboard is open. Exams aren't inside the Dashboard layout, so
// they never show it.
const BottomTabBar = () => {
  const dispatch = useDispatch();
  const [typing, setTyping] = useState(isTyping);

  // The cookie banner sits above the tab bar (cookieBanner.css), only while
  // the bar is actually showing
  useEffect(() => {
    if (typing) return;
    const root = document.documentElement;
    root.classList.add("has-tabbar");
    return () => root.classList.remove("has-tabbar");
  }, [typing]);

  useEffect(() => {
    // focusout fires before the next field gets focus: check once it has
    const update = () => setTimeout(() => setTyping(isTyping()), 0);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);

  if (typing) return null;

  return (
    <nav className="tabBar" aria-label="Main">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className="tabBar-tab"
          // Same as the sidebar: no stale exam questions when starting again
          onClick={() => dispatch(setMockExamQuestion([]))}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="tabBar-highlight"
                  className="tabBar-highlight"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <Icon size={22} aria-hidden="true" />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomTabBar;
