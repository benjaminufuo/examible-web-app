import axios from "axios";

export const getAiResponse = async (
  year,
  subject,
  number,
  question,
  passage,
  options,
  subheadingA,
  subheadingB,
  diagramUrlA,
  diagramUrlB
) => {
  return axios.post(`${import.meta.env.VITE_BASE_URL}api/v1/generate`, {
    year,
    subject,
    number,
    question,
    passage,
    options,
    subheadingA,
    subheadingB,
    diagramUrlA,
    diagramUrlB,
  });
};
