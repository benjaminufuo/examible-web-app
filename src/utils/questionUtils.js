export const LETTERS = ["A", "B", "C", "D", "E"];
export const OPTION_KEYS = ["optionA", "optionB", "optionC", "optionD", "optionE"];

export const normalizeQuestion = (rawItem) => {
  if (!rawItem) return rawItem;
  return {
    ...rawItem,
    question: rawItem.question?.replaceAll("\\n", "\n"),
    subheadingA: rawItem.subheadingA?.replaceAll("\\n", "\n"),
    subheadingB: rawItem.subheadingB?.replaceAll("\\n", "\n"),
    options: rawItem.options?.map((opt) => opt?.replaceAll("\\n", "\n")) || [],
    answer: rawItem.answer?.trim().toUpperCase(),
  };
};

export const getAnswerText = (answerLetter, options) => {
  if (
    !options ||
    !Array.isArray(options) ||
    typeof answerLetter !== "string" ||
    answerLetter.length === 0
  ) {
    return "";
  }
  const index = answerLetter.trim().toUpperCase().charCodeAt(0) - 65;
  if (index < 0 || index >= options.length) return "";
  return options[index];
};

export const deduplicateQuestionMeta = (questions) =>
  questions.reduce((acc, rawItem, index) => {
    const item = normalizeQuestion(rawItem);
    const prev = acc[acc.length - 1]?.item;
    const newItem = {
      subheadingA: !prev || prev.subheadingA !== item.subheadingA ? item.subheadingA : "",
      subheadingB: !prev || prev.subheadingB !== item.subheadingB ? item.subheadingB : "",
      diagramUrlA: !prev || prev.diagramUrlA !== item.diagramUrlA ? item.diagramUrlA : "",
      diagramUrlB: !prev || prev.diagramUrlB !== item.diagramUrlB ? item.diagramUrlB : "",
    };
    acc.push({ item, newItem });
    return acc;
  }, []);
