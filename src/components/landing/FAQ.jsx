import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "Which exams does Examible support?",
    a: "Examible is built around JAMB, WAEC, and NECO, with thousands of verified past questions organized by subject and topic.",
  },
  {
    q: "Do the mock exams feel like the real CBT?",
    a: "Yes. Our mock exams replicate the real JAMB computer-based test interface, timing, and question flow so exam day feels familiar.",
  },
  {
    q: "How does the AI tutor work?",
    a: "The AI tutor explains any question in clear, step-by-step language, answers follow-up questions, and can generate similar practice problems.",
  },
  {
    q: "Can I use Examible offline?",
    a: "Examible supports offline learning so you can keep practicing even with an unstable connection, then sync your progress when you're back online.",
  },
  {
    q: "Is there a free plan?",
    a: "Absolutely. The Freemium plan lets you explore core features for free, and you can upgrade to a monthly or yearly plan anytime.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="ex-section ex-faq" id="faq">
      <div className="ex-container ex-faq__inner">
        <Reveal className="ex-faq__intro" direction="right">
          <span className="ex-eyebrow">FAQ</span>
          <h2 className="ex-h2">
            Questions? <span className="ex-gradient-text">We&apos;ve got answers</span>
          </h2>
          <p className="ex-lead">
            Everything you need to know about preparing with Examible. Still curious?
            Reach out to our team anytime.
          </p>
        </Reveal>

        <div className="ex-faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`ex-faq__item ex-card ${isOpen ? "is-open" : ""}`}
              >
                <button
                  className="ex-faq__q"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span>{f.q}</span>
                  <FiPlus className="ex-faq__plus" size={20} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="ex-faq__a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
