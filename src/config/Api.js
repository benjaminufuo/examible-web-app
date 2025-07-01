import axios from "axios";

export const getAiResponse = async (
  year,
  subject,
  number,
  question,
  passage,
  options
) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}api/v1/generate`,
      { year, subject, number, question, passage, options }
    );
    return res.data.aiResponse;
  } catch (error) {
    console.log(error);
  }
};
