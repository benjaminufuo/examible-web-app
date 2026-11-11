import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

// Loads a part of a page (a popup, the chatbot) only when it's first shown.
// Unlike safeLazy (whole pages), a failure never reloads the page, which would
// throw away what the student is doing: it shows a message and calls
// onLoadError so the caller can close the part. The failed download is
// forgotten, so the next open starts a new one.
//
//   const Bot = lazyPart(() => import("./Bot"));
//   <Bot fallback={<Spinner />} onLoadError={close} {...botProps} />
//   Bot.preload(); // download ahead of time (online only)
export const lazyPart = (importFn) => {
  let Loaded = null; // the component, once downloaded
  let pending = null; // the download in progress

  const load = () => {
    if (Loaded) return Promise.resolve(Loaded);
    pending ??= importFn().then(
      (module) => {
        Loaded = module.default;
        return Loaded;
      },
      (error) => {
        pending = null;
        throw error;
      },
    );
    return pending;
  };

  const Part = ({ fallback = null, onLoadError, ...props }) => {
    const [Component, setComponent] = useState(() => Loaded);
    const onLoadErrorRef = useRef(onLoadError);
    onLoadErrorRef.current = onLoadError;

    useEffect(() => {
      if (Component) return;
      let active = true;
      load().then(
        (loaded) => active && setComponent(() => loaded),
        (error) => {
          if (!active) return;
          console.error("Part of the page failed to load:", error);
          // Online, the browser may be remembering the failed download until
          // the page reloads
          toast.error(
            navigator.onLine
              ? "Couldn't open that. Please refresh the page and try again."
              : "You're offline. Check your connection and try again.",
            { toastId: "lazy-part-failed" },
          );
          onLoadErrorRef.current?.();
        },
      );
      return () => {
        active = false;
      };
    }, [Component]);

    return Component ? <Component {...props} /> : fallback;
  };

  Part.preload = () => {
    if (navigator.onLine) load().catch(() => {});
  };
  return Part;
};
