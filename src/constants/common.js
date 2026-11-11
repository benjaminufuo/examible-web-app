import mathImg from "../assets/public/subjects/maths.webp";
import englishImg from "../assets/public/subjects/english.webp";
import physicsImg from "../assets/public/subjects/physics.webp";
import chemistryImg from "../assets/public/subjects/chemistry.webp";
import biologyImg from "../assets/public/subjects/biology.webp";
import literatureImg from "../assets/public/subjects/literature.webp";
import economicsImg from "../assets/public/subjects/economics.webp";
import governmentImg from "../assets/public/subjects/government.webp";
import commerceImg from "../assets/public/subjects/commerce.webp";
import historyImg from "../assets/public/subjects/history.webp";
import geographyImg from "../assets/public/subjects/geography.webp";
import accountingImg from "../assets/public/subjects/accounting.webp";
import agricultureImg from "../assets/public/subjects/agriculture.webp";

export const allSubjectsData = [
  { subject: "Mathematics", img: mathImg },
  { subject: "English", img: englishImg },
  { subject: "Physics", img: physicsImg },
  { subject: "Chemistry", img: chemistryImg },
  { subject: "Biology", img: biologyImg },
  { subject: "Literature in English", img: literatureImg },
  { subject: "Economics", img: economicsImg },
  { subject: "Government", img: governmentImg },
  { subject: "Commerce", img: commerceImg },
  { subject: "History", img: historyImg },
  { subject: "Geography", img: geographyImg },
  { subject: "Accounting (Principles of Accounts)", img: accountingImg },
  { subject: "Agricultural Science", img: agricultureImg },
];

export const ALLOWED_SUBJECTS = [
  "English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Economics",
  "Accounting (Principles of Accounts)",
  "Literature in English",
  "Government",
  "Agricultural Science",
  "Biology",
  // "Geography",
  // "History",
];

export const ALLOWED_YEARS = Array.from(
  { length: 11 },
  (_, index) => 2025 - index,
);

// Years with no questions on the backend for a given subject
const MISSING_YEARS_BY_SUBJECT = {
  "Agricultural Science": [2016, 2017, 2018],
};

export const getAllowedYearsForSubject = (subject) => {
  const missing = MISSING_YEARS_BY_SUBJECT[subject] || [];
  return ALLOWED_YEARS.filter((year) => !missing.includes(year));
};

export const normalizeMethod = (method = "") => {
  const m = method?.toLowerCase();
  if (m === "card" || m === "bankcard") return "Card";
  if (
    m === "bank" ||
    m === "bankaccount" ||
    m === "bank_transfer" ||
    m === "banktransfer" ||
    m === "bank_tranfer" ||
    m === "pay_with_bank"
  )
    return "Bank Transfer";
  if (m === "ussd" || m === "bankussd") return "USSD";
  if (m === "qr" || m === "opaywalletnpqr" || m === "opaywalletngqr")
    return "QR";
  if (m === "apple_pay") return "Apple Pay";
  if (m === "mobile_money") return "Mobile Money";
  if (m === "eft") return "EFT";
  if (m === "capitec_pay") return "Capitec Pay";
  if (m === "payattitude") return "PayAttitude";
  if (m === "opaywalletng") return "Opay Wallet";
  if (m === "referencecode") return "Reference Code";
  return "-";
};
