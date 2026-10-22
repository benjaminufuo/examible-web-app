import { useCallback, useEffect, useRef } from "react";
import { useOnline } from "./useOnline";
import { isOnline } from "../utils/connectivity";

const MISSED_RECONNECT_RETRY_MS = 2000;

// Retries a submit that failed for lack of connection, once the connection
// is back. Call attemptStarted() when an attempt begins and
// attemptFailedOffline() when it fails with no response.
// - It retries on the change to online, so an unreachable server can't cause
//   a loop of retries (the student can still press the button)
// - If the connection came back while the attempt was still running, that
//   change was missed: it retries once, shortly after
export const useRetryOnReconnect = (retry) => {
  const online = useOnline();
  const retryRef = useRef(retry);
  retryRef.current = retry;
  const waiting = useRef(false); // the last attempt failed offline
  const onlineAtStart = useRef(online);
  const wasOnline = useRef(online);
  const timer = useRef(null);

  const fire = useCallback(() => {
    if (!waiting.current) return;
    waiting.current = false;
    retryRef.current();
  }, []);

  useEffect(() => {
    if (online && !wasOnline.current) fire();
    wasOnline.current = online;
  }, [online, fire]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const attemptStarted = useCallback(() => {
    waiting.current = false;
    clearTimeout(timer.current);
    onlineAtStart.current = isOnline();
  }, []);

  const attemptFailedOffline = useCallback(() => {
    waiting.current = true;
    if (!onlineAtStart.current && isOnline()) {
      timer.current = setTimeout(fire, MISSED_RECONNECT_RETRY_MS);
    }
  }, [fire]);

  return { attemptStarted, attemptFailedOffline };
};
