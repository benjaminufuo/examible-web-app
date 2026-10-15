import { setChatbotMessages } from "../global/slice";

// Tried in order; a later entry is only used if every earlier one errors, times out, or gets rate-limited (429)
export const MODELS = [
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "dots-studio/dots-3-note-preview:free",
];
// A stall guard, not a one-shot "time to first token" check: it's renewed on every
// streamed chunk (content or reasoning), so an actively-responding model is never
// aborted, but a model that goes fully silent for this long still fails over.
const FIRST_TOKEN_TIMEOUT_MS = 12000;

// Streams one model's response, dispatching incremental updates as they arrive.
// Throws (with `.status` set for HTTP errors) if the model errors, times out, or returns nothing —
// callers are expected to catch and try the next model in MODELS.
async function streamFromModel(
  model,
  payloadMessages,
  { chatMessages, dispatch, rafRef, setTyping },
) {
  const controller = new AbortController();
  let timeoutId = setTimeout(
    () => controller.abort(),
    FIRST_TOKEN_TIMEOUT_MS,
  );

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: payloadMessages,
          stream: true,
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const error = new Error(`API error: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          // Any parseable chunk is a sign of life — renew the stall guard so a model
          // that keeps streaming (even reasoning-only, or empty keep-alive frames)
          // is never abandoned mid-response.
          clearTimeout(timeoutId);
          timeoutId = setTimeout(
            () => controller.abort(),
            FIRST_TOKEN_TIMEOUT_MS,
          );

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
        } catch (_e) {
          // ignore
        }
      }
    }

    if (!accumulated) throw new Error("No content received");
    dispatch(
      setChatbotMessages([
        ...chatMessages,
        { message: accumulated, sender: "bot", direction: "incoming" },
      ]),
    );
    return accumulated;
  } finally {
    // Guarantee this runs even if fetch() rejects or reader.read() throws, so a failed
    // attempt never leaves a stale RAF/timeout that could fire during the next model's attempt.
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    clearTimeout(timeoutId);
  }
}

// Tries each model in MODELS in order, falling back to the next on error, timeout, or 429.
// Re-arms the typing indicator before each retry, since a model that streamed partial
// content before failing will have already turned it off.
export async function streamChatWithFallback(
  payloadMessages,
  { chatMessages, dispatch, rafRef, setTyping },
) {
  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    try {
      return await streamFromModel(model, payloadMessages, {
        chatMessages,
        dispatch,
        rafRef,
        setTyping,
      });
    } catch (err) {
      console.warn(
        `[LegacyChatbot] ${model} failed (${err?.status ?? err?.name ?? "error"})`,
        err,
      );
      if (i === MODELS.length - 1) throw err;
      setTyping(true); // re-show the typing indicator while the next model is attempted
      dispatch(setChatbotMessages(chatMessages)); // clear any partial output before retrying
    }
  }
}

// Non-streaming, best-effort: asks the model for 3 short follow-up prompts based on the
// conversation so far. Never throws — callers get [] on any failure (timeout, bad response,
// unparsable output) since this is a UX nicety, not something worth surfacing an error for.
const FOLLOWUP_TIMEOUT_MS = 8000;
const FOLLOWUP_SYSTEM_PROMPT =
  "Based on the conversation so far, suggest exactly 3 short follow-up prompts the student " +
  "might naturally want to send next (e.g. asking for an example, a simpler explanation, or a " +
  "practice question). Reply with ONLY the 3 suggestions, one per line — no numbering, no " +
  "bullets, no quotes, no extra commentary. Each under 8 words, phrased as something the " +
  "student would type, directly relevant to what was just discussed.";

function parseFollowUpSuggestions(text) {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s*•\-\d.)]+/, "").trim())
    .filter((line) => line.length > 0 && line.length <= 80)
    .slice(0, 3);
}

export async function fetchFollowUpSuggestions(payloadMessages) {
  const requestMessages = [
    ...payloadMessages,
    { role: "system", content: FOLLOWUP_SYSTEM_PROMPT },
  ];

  for (const model of MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      FOLLOWUP_TIMEOUT_MS,
    );
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: requestMessages,
            stream: false,
            max_tokens: 80,
            temperature: 0.7,
          }),
          signal: controller.signal,
        },
      );
      if (!response.ok) continue;
      const data = await response.json();
      const parsed = parseFollowUpSuggestions(data.choices?.[0]?.message?.content);
      if (parsed.length) return parsed;
    } catch (_err) {
      // silent — try the next model
    } finally {
      clearTimeout(timeoutId);
    }
  }
  return [];
}
