import { useEffect, useState } from "react";
import "../styles/header.css";
import menuBar from "../assets/navBar.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderLogo from "../assets/public/logo.png";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showDropdown ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDropdown]);

  return (
    <header className={`ex-header ${scrolled ? "ex-header--scrolled" : ""}`}>
      <div className="ex-header__inner">
        <button
          className="ex-header__brand"
          onClick={() => nav("/")}
          aria-label="Examible home"
        >
          <img src={HeaderLogo} alt="Examible" />
        </button>

        <nav className="ex-header__nav" aria-label="Primary">
          <ul>
            {menuBar.map((item) => (
              <li
                key={item.id}
                className={location.pathname === item.link ? "active" : ""}
              >
                <Link to={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ex-header__actions">
          <ThemeToggle />
          <button className="ex-btn ex-btn-ghost ex-header__cta" onClick={() => nav("/signup")}>
            Sign Up
          </button>
          <button className="ex-btn ex-btn-primary ex-header__cta" onClick={() => nav("/login")}>
            Login
          </button>
        </div>

        <div className="ex-header__mobileActions">
          <ThemeToggle />
          <button
            className="ex-header__menuBtn"
            aria-label="Open menu"
            onClick={() => setShowDropdown(true)}
          >
            <HiMenuAlt4 size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="ex-header__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowDropdown(false)}
          >
            <motion.div
              className="ex-header__drawer ex-glass"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ex-header__drawerTop">
                <img src={HeaderLogo} alt="Examible" className="ex-header__drawerLogo" />
                <button
                  className="ex-header__menuBtn"
                  aria-label="Close menu"
                  onClick={() => setShowDropdown(false)}
                >
                  <HiX size={24} />
                </button>
              </div>

              <ul className="ex-header__drawerNav">
                {menuBar.map((item) => (
                  <li
                    key={item.id}
                    className={location.pathname === item.link ? "active" : ""}
                    onClick={() => setShowDropdown(false)}
                  >
                    <Link to={item.link}>{item.name}</Link>
                  </li>
                ))}
              </ul>

              <div className="ex-header__drawerActions">
                <button
                  className="ex-btn ex-btn-ghost"
                  onClick={() => {
                    setShowDropdown(false);
                    nav("/signup");
                  }}
                >
                  Sign Up
                </button>
                <button
                  className="ex-btn ex-btn-primary"
                  onClick={() => {
                    setShowDropdown(false);
                    nav("/login");
                  }}
                >
                  Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
