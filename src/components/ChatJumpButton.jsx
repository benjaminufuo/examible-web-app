import { useEffect, useState } from "react";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";
import { useChatScroll } from "../hooks/useChatScroll";

const LABEL_ON_TOUCH_MS = 2000;

// "Scroll to bottom" / "Scroll to top" for the AI tutor's message list, and
// opening the chat at the latest message (see useChatScroll).
// A separate component on purpose: its state changes on every scroll, and
// re-rendering chatscope's MessageList mid-scroll can make it jump.
const ChatJumpButton = ({ listClass, hidden, contentKey, lastMessage }) => {
  const { jump, buttonTop, toBottom, toTop, update } = useChatScroll(listClass);
  const [showLabel, setShowLabel] = useState(false);

  // New messages, streamed text or the follow-up row change the list's size
  useEffect(update, [contentKey, lastMessage, hidden, update]);

  // Touch screens have no hover: show the label briefly whenever the button
  // appears or changes direction (desktop shows it on hover and focus)
  useEffect(() => {
    if (!jump || !window.matchMedia?.("(hover: none)").matches) return;
    setShowLabel(true);
    const timer = setTimeout(() => setShowLabel(false), LABEL_ON_TOUCH_MS);
    return () => clearTimeout(timer);
  }, [jump]);

  if (!jump || hidden || buttonTop === null) return null;
  const down = jump === "down";
  const label = down ? "Scroll to bottom" : "Scroll to top";
  return (
    <div
      className={`legacybot-jump ${showLabel ? "legacybot-jump--labelled" : ""}`}
      style={{ top: buttonTop }}
    >
      <span className="legacybot-jump__label" aria-hidden="true">
        {label}
      </span>
      <button
        type="button"
        className="legacybot-jump__button"
        onClick={() => (down ? toBottom() : toTop())}
        aria-label={label}
      >
        {down ? <LuArrowDown size={18} /> : <LuArrowUp size={18} />}
      </button>
    </div>
  );
};

export default ChatJumpButton;
