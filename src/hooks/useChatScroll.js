import { useCallback, useEffect, useRef, useState } from "react";

// Scrolling for the AI tutor's message list (chatscope's MessageList, found by
// the class passed as listClass; its ref doesn't expose the scroll element):
// - opens at the latest message: an instant jump once the list is there, then
//   again once maths, markdown and fonts have finished changing the messages'
//   heights (a smooth scroll over a long chat gets cut short by those changes)
// - jump: "down" when the student has scrolled up more than a screen, "up"
//   when they're at the bottom of a chat longer than two screens, else null
// - buttonTop: where to place the jump button inside the positioned parent
//   (just above the list's bottom edge, wherever the input and chips are)
// - update(): call when the content changes; measuring is batched to at most
//   once per animation frame, and it also finds the list if it wasn't there yet
const SETTLE_MS = 400;
const AT_BOTTOM_PX = 8;
const BUTTON_OFFSET_PX = 52; // button height (36) + gap (16)
const SCROLL_MS = 450;

export const useChatScroll = (listClass) => {
  const [jump, setJump] = useState(null);
  const [buttonTop, setButtonTop] = useState(null);
  const [scroller, setScroller] = useState(null);
  const scrollerRef = useRef(null);

  const getScroller = useCallback(() => {
    if (!scrollerRef.current?.isConnected) {
      scrollerRef.current = document.querySelector(
        `.${listClass} .cs-message-list__scroll-wrapper`,
      );
    }
    return scrollerRef.current;
  }, [listClass]);

  const measure = useCallback(() => {
    const el = getScroller();
    setScroller(el); // no re-render when it's the same element
    if (!el) return;
    const fromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (fromBottom > el.clientHeight) setJump("down");
    else if (
      fromBottom <= AT_BOTTOM_PX &&
      el.scrollHeight > 2 * el.clientHeight
    )
      setJump("up");
    else setJump(null);

    const parent = el.closest(".chatbot-body");
    if (parent) {
      const list = el.getBoundingClientRect();
      const box = parent.getBoundingClientRect();
      setButtonTop(list.bottom - box.top - BUTTON_OFFSET_PX);
    }
  }, [getScroller]);

  // Scroll events and streamed text can fire many times per frame: measure
  // (which reads the layout) at most once per frame
  const pending = useRef(null);
  const update = useCallback(() => {
    if (pending.current) return;
    pending.current = requestAnimationFrame(() => {
      pending.current = null;
      measure();
    });
  }, [measure]);
  useEffect(() => () => cancelAnimationFrame(pending.current), []);

  // Animated by hand: the list uses overflow: hidden (chatscope draws its own
  // scrollbar), and browsers don't animate scrollTo({ behavior: "smooth" })
  // on such an element
  const animation = useRef(null);
  const scrollToY = useCallback(
    (target, smooth = true) => {
      const el = getScroller();
      if (!el) return;
      cancelAnimationFrame(animation.current);
      const reduced = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!smooth || reduced) {
        el.scrollTop = target;
        return;
      }
      const from = el.scrollTop;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / SCROLL_MS);
        const eased = 1 - (1 - t) ** 3; // ease-out
        el.scrollTop = from + (target - from) * eased;
        if (t < 1) animation.current = requestAnimationFrame(step);
      };
      animation.current = requestAnimationFrame(step);
    },
    [getScroller],
  );
  useEffect(() => () => cancelAnimationFrame(animation.current), []);

  const toBottom = useCallback(
    (smooth = true) => {
      const el = getScroller();
      if (el) scrollToY(el.scrollHeight - el.clientHeight, smooth);
    },
    [getScroller, scrollToY],
  );

  const toTop = useCallback(() => scrollToY(0), [scrollToY]);

  // Find the list as soon as possible (update() keeps looking if it isn't
  // there yet)
  useEffect(update, [update]);

  // Open at the latest message, once the list has been found
  useEffect(() => {
    if (!scroller) return undefined;
    toBottom(false);
    update();
    const settle = setTimeout(() => {
      toBottom(false);
      update();
    }, SETTLE_MS);
    return () => clearTimeout(settle);
    // Only when the list first appears, not on every update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroller]);

  // Keep the button in step with scrolling, resizing and size changes
  useEffect(() => {
    if (!scroller) return undefined;
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(update) : null;
    observer?.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [scroller, update]);

  return { jump, buttonTop, toBottom, toTop, update };
};
