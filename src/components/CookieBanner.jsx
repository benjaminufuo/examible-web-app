import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { LuX } from "react-icons/lu";
import { getConsent, setConsent } from "../utils/consent";
import "../styles/cookieBanner.css";

// Asks once (and again after 12 months or a privacy policy change) whether
// Examible may use analytics cookies. It explains why up front, for everyone,
// and "What we collect" lists exactly what's measured. Accept and Decline
// look the same and nothing is pre-selected; closing it counts as Decline,
// with no extra step (consent must be as easy to refuse as to give). The
// footer's "Cookie settings" opens it again.

// Must match what track() and the page views actually send
const COLLECTED = [
  "The pages you visit and the features you use, like starting a CBT",
  "Your device type and browser, and whether you use the app or the website",
  "Whether you were offline, and for how long",
  "Your plan (Free or Premium) and your account number, never your name or email",
];
const CookieBanner = () => {
  const [open, setOpen] = useState(() => getConsent() === null);
  const [details, setDetails] = useState(false);
  const detailsId = useId();

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("opencookiesettings", show);
    return () => window.removeEventListener("opencookiesettings", show);
  }, []);

  if (!open) return null;

  const choose = (analytics) => {
    setConsent(analytics);
    setOpen(false);
  };

  return (
    <section className="cookie-banner" role="region" aria-label="Cookie choice">
      <div className="cookie-banner__body">
        <p className="cookie-banner__text">
          Help us make Examible better for your exam prep. We use analytics to
          see which features help students learn. No ads, and your answers and
          messages are never shared. You can change this anytime in Cookie
          settings.
        </p>
        <p className="cookie-banner__links">
          <button
            type="button"
            className="cookie-banner__link"
            aria-expanded={details}
            aria-controls={detailsId}
            onClick={() => setDetails((d) => !d)}
          >
            What we collect
          </button>
          <span aria-hidden="true">·</span>
          <Link to="/privacy-policy" className="cookie-banner__link">
            Privacy Policy
          </Link>
        </p>
        {details && (
          <div className="cookie-banner__details" id={detailsId}>
            <p>With your permission, we measure:</p>
            <ul>
              {COLLECTED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              Never collected: your answers, your messages to the AI tutor,
              passwords or payment details. Your personalised insights work
              either way.
            </p>
          </div>
        )}
      </div>
      <div className="cookie-banner__actions">
        <button
          type="button"
          className="cookie-banner__button"
          onClick={() => choose("denied")}
        >
          Decline
        </button>
        <button
          type="button"
          className="cookie-banner__button"
          onClick={() => choose("granted")}
        >
          Accept
        </button>
      </div>
      <button
        type="button"
        className="cookie-banner__close"
        onClick={() => choose("denied")}
        aria-label="Close and decline analytics cookies"
      >
        <LuX size={18} />
      </button>
    </section>
  );
};

export default CookieBanner;
