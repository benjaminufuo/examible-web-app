import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "examible-theme";
const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {}, setTheme: () => {} });

const getStoredTheme = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return null;
};

const getSystemTheme = () => {
  // Premium product defaults to dark, but respect an explicit light system preference.
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
};

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  return getStoredTheme() || getSystemTheme();
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    // Browser bar / installed app title bar: match the app's theme, not the
    // device's (index.html's media-based tags only cover the first paint)
    const bg = getComputedStyle(root).getPropertyValue("--ex-bg").trim();
    if (bg) {
      document
        .querySelectorAll('meta[name="theme-color"]')
        .forEach((meta) => meta.setAttribute("content", bg));
    }
    // enable smooth transitions only after first paint
    requestAnimationFrame(() => root.classList.add("ex-theme-ready"));
  }, [theme]);

  // Follow the device/browser theme until the user picks one manually
  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (e) => {
      if (getStoredTheme()) return;
      setThemeState(e.matches ? "light" : "dark");
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  // Only an explicit user choice is persisted
  const persistTheme = (next) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const setTheme = useCallback((next) => {
    const value = next === "light" ? "light" : "dark";
    persistTheme(value);
    setThemeState(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      persistTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
