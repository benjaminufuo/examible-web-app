import { useEffect, useState } from "react";

const PHONE_QUERY = "(max-width: 600px)";

// True on phone-width screens, kept in sync when the window is resized
export const useIsPhone = () => {
  const [isPhone, setIsPhone] = useState(
    () => window.matchMedia(PHONE_QUERY).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(PHONE_QUERY);
    const onChange = (e) => setIsPhone(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return isPhone;
};
