// A mock test's time: what it allowed and what the student used, in seconds.
// Sent with the rating (secondsUsed is its "duration") and shown on the
// result page. A CBT's time comes from the server (lastCbtDetails).
export const getMockTiming = ({ examTimerMins, examTimerSecs, plan }) => {
  const totalMinutes =
    parseInt(sessionStorage.getItem("mockExamDuration")) ||
    (plan === "Freemium" ? 10 : 30);
  const totalSeconds = totalMinutes * 60;
  const timeLeft = examTimerMins * 60 + examTimerSecs;
  const secondsUsed = Math.min(7200, Math.max(1, totalSeconds - timeLeft));
  return { totalSeconds, secondsUsed };
};
