import {
  LuBookOpen,
  LuClipboardList,
  LuHouse,
  LuMonitor,
  LuUserRound,
} from "react-icons/lu";

// The installed app's bottom tab bar (decision D9). Back buttons show on every
// dashboard page except these.
export const TABS = [
  { to: "/overview", label: "Overview", Icon: LuHouse },
  { to: "/past-questions", label: "Past Qs", Icon: LuBookOpen },
  { to: "/mock-exam", label: "Mock", Icon: LuClipboardList },
  { to: "/cbt-mode", label: "CBT", Icon: LuMonitor },
  { to: "/profile", label: "Profile", Icon: LuUserRound },
];
