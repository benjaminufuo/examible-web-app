// The JAMB CBT layout, shared by the exam and the result page: 60 English
// questions and 40 for each other subject (180 in all). The Free plan unlocks
// 20 English and 10 per other subject; the rest show as locked.

const isEnglish = (subject) => subject?.toLowerCase().includes("english");

export const CBT_TOTAL_QUESTIONS = 180;

/** Questions in the full JAMB CBT for this subject */
export const cbtFullCount = (subject) => (isEnglish(subject) ? 60 : 40);

/** Questions the Free plan unlocks for this subject */
export const cbtFreeCount = (subject) => (isEnglish(subject) ? 20 : 10);
