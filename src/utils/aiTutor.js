import { setChatbotMessages } from "../global/slice";
import { baseApi, endSession, notePlanHeader } from "../config/baseApi";
import { appHeaders } from "./appVersion";
import { isUpdateRequiredResponse, markUpdateRequired } from "./updateRequired";
import { reportNetworkError, reportServerResponse } from "./connectivity";

// The AI tutor goes through our backend (/api/v1/ai/chat), which holds the
// OpenRouter key, checks the plan and limits, and picks the model (falling back
// to another one itself). The stream is OpenRouter's, passed through unchanged.

const CHAT_URL = `${import.meta.env.VITE_BASE_URL}api/v1/ai/chat`;

// The server may try two models (up to 20 seconds each) before answering
const FIRST_RESPONSE_TIMEOUT_MS = 45000;
// Once text is streaming: a reply that goes silent this long is given up on
const STALL_TIMEOUT_MS = 12000;
// Only the system prompt and the latest messages are sent, so long chats stay
// small (the server trims the same way, as a safety net)
const MAX_HISTORY = 20;
// The server may try two models, up to 8 seconds each
const SUGGESTIONS_TIMEOUT_MS = 20000;

const ERROR_MESSAGES = {
  403: "The AI tutor is a Premium feature.",
  426: "A new version of Examible is needed. Update to keep using the AI tutor.",
  429: "You're sending messages too fast. Wait a moment.",
  network: "Couldn't reach the AI tutor. Check your internet and try again.",
  timeout: "The AI tutor took too long to answer. Try again.",
  unavailable: "The AI tutor is unavailable. Try again shortly.",
};

const tutorError = (kind, status) => {
  const error = new Error(ERROR_MESSAGES[kind] ?? ERROR_MESSAGES.unavailable);
  error.status = status;
  return error;
};

/** What to show the student for an error thrown by streamChat */
export const aiTutorErrorMessage = (error) =>
  error?.message && Object.values(ERROR_MESSAGES).includes(error.message)
    ? error.message
    : ERROR_MESSAGES.unavailable;

// Whether a reply is still streaming in. It outlives the chat window: closing
// the chat doesn't stop the reply, so a reopened chat must wait for it before
// the student can send again (two streams would overwrite each other's
// messages). Read it with useAiReplyInProgress().
let replyInProgress = false;
const replyListeners = new Set();
const setReplyInProgress = (value) => {
  replyInProgress = value;
  replyListeners.forEach((fn) => fn());
};
export const isAiReplyInProgress = () => replyInProgress;
export const subscribeAiReply = (fn) => {
  replyListeners.add(fn);
  return () => replyListeners.delete(fn);
};

export const trimHistory = (payloadMessages) => [
  payloadMessages[0],
  ...payloadMessages.slice(1).slice(-MAX_HISTORY),
];

// Streams the reply into the chat, dispatching updates as they arrive (one per
// animation frame). Resolves to { text, suggestions, incomplete }:
// - suggestions: "on" or "off" (the server's switch for follow-up suggestions)
// - incomplete: the stream broke or went silent after some text arrived; the
//   text is kept, and the message is marked { incomplete: true }
// Throws an Error whose message is ready to show (see aiTutorErrorMessage),
// with .status set for HTTP errors. On 401 the session has already been ended
// (the store is reset), so the caller must not write to the chat.
export async function streamChat(
  payloadMessages,
  { chatMessages, dispatch, rafRef, setTyping },
) {
  const controller = new AbortController();
  let reader = null;
  let timedOut = false;
  const arm = (ms) =>
    setTimeout(() => {
      timedOut = true;
      controller.abort();
      // Also end a pending read directly, so a stalled stream can never hang
      reader?.cancel().catch(() => {});
    }, ms);
  let timeoutId = arm(FIRST_RESPONSE_TIMEOUT_MS);
  setReplyInProgress(true);

  try {
    let response;
    try {
      response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          ...appHeaders(),
        },
        body: JSON.stringify({ messages: trimHistory(payloadMessages) }),
        signal: controller.signal,
      });
    } catch {
      // No answer at all: let the installed app check whether it's offline
      if (!timedOut) reportNetworkError();
      throw tutorError(timedOut ? "timeout" : "network");
    }

    reportServerResponse(); // the server answered: we're online
    // Plan expired or upgraded: same check as every other API response
    notePlanHeader(response.headers.get("X-Plan"));

    if (!response.ok) {
      const { status } = response;
      if (status === 401 || status === 426) {
        const body = await response.json().catch(() => ({}));
        if (status === 401) {
          endSession(body?.message ?? "Your session has ended. Log in again.");
        } else if (isUpdateRequiredResponse(status, body)) {
          markUpdateRequired();
        }
      }
      throw tutorError(status, status);
    }

    const suggestions =
      response.headers.get("X-AI-Suggestions") === "on" ? "on" : "off";

    // Streaming has started: from now on, only silence between chunks counts
    clearTimeout(timeoutId);
    timeoutId = arm(STALL_TIMEOUT_MS);

    reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    let buffer = "";
    let finished = false; // the stream ended normally ([DONE] or closed)

    const handleLine = (line) => {
      if (!line.startsWith("data: ")) return;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta;
        if (delta?.content) {
          if (!accumulated) setTyping(false);
          accumulated += delta.content;
          // Batch UI updates to one dispatch per animation frame
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            dispatch(
              setChatbotMessages([
                ...chatMessages,
                {
                  message: accumulated,
                  sender: "bot",
                  direction: "incoming",
                },
              ]),
            );
            rafRef.current = null;
          });
        }
      } catch {
        // ignore
      }
    };

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Any bytes are a sign of life, including OpenRouter's keep-alive
        // comments (": OPENROUTER PROCESSING") while a model is still
        // thinking: renew the stall guard
        clearTimeout(timeoutId);
        timeoutId = arm(STALL_TIMEOUT_MS);

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        lines.forEach(handleLine);
      }
      // A stall cancels the reader, which also ends the loop: that's not a
      // normal end
      finished = !timedOut;
    } catch {
      // The stream broke or went silent
    }
    // Whatever is left (a last line without a trailing newline)
    buffer += decoder.decode();
    buffer.split("\n").forEach(handleLine);

    // Nothing at all arrived: an error. Some text: keep it, marked incomplete
    // unless the stream ended normally.
    if (!accumulated) {
      throw tutorError(
        timedOut ? "timeout" : finished ? "unavailable" : "network",
      );
    }
    const incomplete = !finished;
    dispatch(
      setChatbotMessages([
        ...chatMessages,
        {
          message: accumulated,
          sender: "bot",
          direction: "incoming",
          ...(incomplete && { incomplete: true }),
        },
      ]),
    );
    return { text: accumulated, suggestions, incomplete };
  } finally {
    setReplyInProgress(false);
    // Runs even when fetch() rejects or reader.read() throws, so no stale
    // animation frame or timeout fires later
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    clearTimeout(timeoutId);
  }
}

// Best-effort: 3 short follow-up prompts for the conversation so far. Never
// throws and never shows an error (silent): [] on any failure.
export async function fetchFollowUpSuggestions(payloadMessages) {
  try {
    const res = await baseApi.instance.post(
      "/ai/suggestions",
      { messages: trimHistory(payloadMessages) },
      { silent: true, timeout: SUGGESTIONS_TIMEOUT_MS },
    );
    if (res?.data?.disabled) return [];
    const list = res?.data?.suggestions;
    return Array.isArray(list) ? list.slice(0, 3) : [];
  } catch {
    return [];
  }
}
