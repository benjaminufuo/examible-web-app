import Reveal from "./Reveal";
import TestimonialCarousel from "../TestimonialCarousel";

const testimonials = [
  {
    quote:
      "Examible's mock exams felt exactly like the real JAMB CBT. By exam day I wasn't nervous at all — I knew the interface and the pacing.",
    name: "Tolu A.",
    role: "Scored 298 in JAMB",
    color: "#804bf2",
  },
  {
    quote:
      "The AI tutor is incredible. Whenever I got a question wrong it explained the reasoning until it actually clicked. My accuracy jumped fast.",
    name: "Amara O.",
    role: "Aspiring medical student",
    color: "#06b6d4",
  },
  {
    quote:
      "Going through real JAMB past questions year by year showed me exactly which topics repeat. I walked into the exam knowing every pattern — that focus is what pushed my score over 300.",
    name: "Chisom E.",
    role: "Scored 304 in JAMB",
    color: "#10b981",
  },
  {
    quote:
      "After every mock exam, the instant breakdown told me exactly where I was dropping marks. I fixed those weak spots in two weeks and my score jumped by over 40 points.",
    name: "Blessing T.",
    role: "Scored 287 in JAMB",
    color: "#f97316",
  },
];

const Testimonials = () => {
  return (
    <section className="ex-section ex-testi">
      <div className="ex-container">
        <Reveal className="ex-section-head">
          <span className="ex-eyebrow">Loved by students</span>
          <h2 className="ex-h2">
            Real results from{" "}
            <span className="ex-gradient-text">real candidates</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <TestimonialCarousel testimonials={testimonials} />
        </Reveal>
      </div>
    </section>
  );
};

export default Testimonials;
