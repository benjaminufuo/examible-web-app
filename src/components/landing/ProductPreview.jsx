import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBarChart2,
  FiMonitor,
  FiMessageSquare,
  FiAward,
} from "react-icons/fi";

const tabs = [
  // { id: "analytics", label: "Analytics", Icon: FiBarChart2 },
  { id: "exam", label: "Mock Exam", Icon: FiMonitor },
  { id: "ai", label: "AI Tutor", Icon: FiMessageSquare },
  // { id: "leaderboard", label: "Leaderboard", Icon: FiAward },
];

const AnalyticsView = () => (
  <div className="ex-preview__analytics">
    <div className="ex-preview__cards">
      {[
        { l: "Predicted score", v: "312", d: "+24 this month" },
        { l: "Questions solved", v: "1,284", d: "+96 this week" },
        { l: "Accuracy", v: "86%", d: "+5% improvement" },
      ].map((c) => (
        <div className="ex-preview__metric" key={c.l}>
          <small>{c.l}</small>
          <strong>{c.v}</strong>
          <em>{c.d}</em>
        </div>
      ))}
    </div>
    <div className="ex-preview__chartBox">
      <div className="ex-preview__line">
        <svg viewBox="0 0 320 120" preserveAspectRatio="none">
          <polyline
            points="0,90 45,76 90,82 135,54 180,60 225,34 270,40 320,16"
            fill="none"
            stroke="var(--ex-brand)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points="0,90 45,76 90,82 135,54 180,60 225,34 270,40 320,16 320,120 0,120"
            fill="var(--ex-brand-soft)"
          />
        </svg>
        <span className="ex-preview__lineLabel">
          Score trend · last 8 weeks
        </span>
      </div>
    </div>
  </div>
);

const ExamView = () => (
  <div className="ex-preview__exam">
    <div className="ex-preview__examTop">
      <span>Question 14 of 40</span>
      <span className="ex-preview__timer">23:18</span>
    </div>
    <p className="ex-preview__q">If 2x + 3 = 11, what is the value of x?</p>
    <div className="ex-preview__options">
      {[
        { k: "A", t: "3", correct: false },
        { k: "B", t: "4", correct: true },
        { k: "C", t: "5", correct: false },
        { k: "D", t: "7", correct: false },
      ].map((o) => (
        <div
          className={`ex-preview__opt ${o.correct ? "is-correct" : ""}`}
          key={o.k}
        >
          <span>{o.k}</span>
          {o.t}
        </div>
      ))}
    </div>
    <div className="ex-preview__examNav">
      <button className="ex-btn ex-btn-ghost">Previous</button>
      <button className="ex-btn ex-btn-primary">Next question</button>
    </div>
  </div>
);

const AIView = () => (
  <div className="ex-preview__ai">
    <div className="ex-preview__bubble ex-preview__bubble--user">
      Why is the answer B for question 14?
    </div>
    <div className="ex-preview__bubble ex-preview__bubble--bot">
      Great question. Start with 2x + 3 = 11. Subtract 3 from both sides to get
      2x = 8, then divide by 2. That gives x = 4, which is option B.
    </div>
    <div className="ex-preview__bubble ex-preview__bubble--user">
      Can you give me a similar one to try?
    </div>
    <div className="ex-preview__typing">
      <span />
      <span />
      <span />
    </div>
  </div>
);

const LeaderboardView = () => (
  <div className="ex-preview__leaderboard">
    {[
      { r: 1, n: "Amara O.", xp: "4,820", you: false },
      { r: 2, n: "David K.", xp: "4,510", you: false },
      { r: 3, n: "Fatima B.", xp: "4,295", you: false },
      { r: 4, n: "You", xp: "4,180", you: true },
      { r: 5, n: "Chidi N.", xp: "3,970", you: false },
    ].map((row) => (
      <div
        className={`ex-preview__lbRow ${row.you ? "is-you" : ""}`}
        key={row.r}
      >
        <span className="ex-preview__lbRank">{row.r}</span>
        <span className="ex-preview__lbName">{row.n}</span>
        <span className="ex-preview__lbXp">{row.xp} XP</span>
      </div>
    ))}
  </div>
);

const views = {
  // analytics: <AnalyticsView />,
  exam: <ExamView />,
  ai: <AIView />,
  // leaderboard: <LeaderboardView />,
};

const ProductPreview = () => {
  const [active, setActive] = useState("exam");

  return (
    <section className="ex-section ex-preview" id="product">
      <div className="ex-container">
        <div className="ex-section-head">
          <span className="ex-eyebrow">See it in action</span>
          <h2 className="ex-h2">
            One platform, your{" "}
            <span className="ex-gradient-text">entire prep journey</span>
          </h2>
          <p className="ex-lead">
            Switch between {/* analytics,  */}
            realistic CBT exams, your AI tutor {/* , and live leaderboards  */}—
            all in a single, beautifully designed workspace.
          </p>
        </div>

        <div className="ex-preview__tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`ex-preview__tab ${active === t.id ? "is-active" : ""}`}
              onClick={() => setActive(t.id)}
            >
              <t.Icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="ex-preview__window ex-card">
          <div className="ex-preview__chrome">
            <span />
            <span />
            <span />
            <em>app.examible.com</em>
          </div>
          <div className="ex-preview__body">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3 }}
              >
                {views[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview;
