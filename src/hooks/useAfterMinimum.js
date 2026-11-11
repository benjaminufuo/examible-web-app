import { useCallback, useEffect, useRef } from "react";

// Runs fn once the page has been showing for at least `ms`: long enough that a
// loading screen doesn't just flash, without a fixed wait when the request
// itself was slow. Cancelled if the page closes first, so it never navigates
// away from wherever the student went instead.
const useAfterMinimum = (ms = 1000) => {
  const mountedAt = useRef(Date.now());
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  return useCallback(
    (fn) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(
        fn,
        Math.max(0, ms - (Date.now() - mountedAt.current)),
      );
    },
    [ms],
  );
};

export default useAfterMinimum;
