import { questionApi } from "../config/questionApi";
import { applyCbtReview, cancelExam, setUser } from "../global/slice";

// Submits a CBT (v2) and, on success, puts the review into the store (correct
// letters for the result page, scores for the recorded answers) and saves the
// updated student. A 200 for an already-submitted session (a retry after a
// lost reply) is a success too: its stored review is applied the same way.
//
// Resolves to { ok: true, details } or { ok: false, reason }:
// - "offline": no response (offline or connection dropped); the answers are
//   still in the store, so the same submit can be retried
// - "ended":   404 or 410, the session is over ("Start a new CBT")
// - "error":   any other server error
export async function submitCbtV2({ dispatch, sessionId, exam }) {
  const answers = exam.map((q) => ({
    subject: q.subject,
    index: q.number,
    option: q.option ?? null,
  }));
  try {
    const res = await questionApi.submitCbt({ sessionId, answers });
    if (!res?.data?.success) return { ok: false, reason: "error" };
    dispatch(applyCbtReview(res.data.review));
    dispatch(setUser(res.data.data));
    return { ok: true, details: res.data.data?.lastCbtDetails };
  } catch (error) {
    const status = error?.response?.status;
    if (!error?.response) return { ok: false, reason: "offline" };
    if (status === 404 || status === 410) return { ok: false, reason: "ended" };
    return { ok: false, reason: "error" };
  }
}

// The submit screens' messages (CBT and mock exams)
export const EXAM_SUBMIT_MESSAGES = {
  offline: "You're offline. Your answers are saved. Reconnect to submit.",
  ended: "This exam session has ended. Start a new CBT.",
  error: "Something went wrong. Please try again.",
};

// "Start a new CBT" after a session has ended: clear the exam, back to CBT
export const startNewCbt = (dispatch, nav) => {
  dispatch(cancelExam());
  nav("/cbt-mode", { replace: true });
};
