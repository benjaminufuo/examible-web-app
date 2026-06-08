import "../styles/footer.css";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import FooterLogo from "../assets/public/logo.png";
import { Link, useNavigate } from "react-router-dom";

const productLinks = [
  { label: "Mock Exam", to: "/mock-exam" },
  { label: "Past Questions", to: "/past-questions" },
  { label: "Examible Bot", to: "/login" },
  { label: "Pricing", to: "/plans" },
];

const companyLinks = [
  { label: "About Us", to: "/about-us" },
  { label: "Get Started", to: "/signup" },
  { label: "Login", to: "/login" },
];

const socials = [
  {
    Icon: FaFacebook,
    href: "https://web.facebook.com/Examible",
    label: "Facebook",
  },
  {
    Icon: FaLinkedin,
    href: "https://www.linkedin.com/company/examible",
    label: "LinkedIn",
  },
  {
    Icon: FaInstagram,
    href: "https://www.instagram.com/examible",
    label: "Instagram",
  },
];

const Footer = () => {
  const nav = useNavigate();

  return (
    <footer className="ex-footer">
      <div className="ex-container ex-footer__cta">
        <div className="ex-footer__ctaCard ex-card">
          <div className="ex-footer__ctaGlow" aria-hidden="true" />
          <div className="ex-footer__ctaText">
            <h2 className="ex-h2">Start your success journey today.</h2>
            <p className="ex-lead">
              Join thousands of students preparing smarter for JAMB, WAEC, and
              NECO with AI-powered practice.
            </p>
          </div>
          <div className="ex-footer__ctaActions">
            <button
              className="ex-btn ex-btn-primary ex-btn-lg"
              onClick={() => nav("/signup")}
            >
              Start practicing free
            </button>
            <button
              className="ex-btn ex-btn-ghost ex-btn-lg"
              onClick={() => {
                const el = document.getElementById("pricing");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View plans
            </button>
          </div>
        </div>
      </div>

      <div className="ex-container ex-footer__grid">
        <div className="ex-footer__brand">
          <img src={FooterLogo} alt="Examible" />
          <p>
            The future of exam preparation for African students, powered by AI.
          </p>
          <div className="ex-footer__socials">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="ex-footer__col">
          <h4>Product</h4>
          <ul>
            {productLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="ex-footer__col">
          <h4>Company</h4>
          <ul>
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="ex-footer__col ex-footer__contact">
          <h4>Get in touch</h4>
          <a className="ex-footer__email" href="mailto:info@examible.com">
            <MdEmail size={18} />
            info@examible.com
          </a>
          <p>Flat 4, 6 Yusuf Olorinde Street, Olodi Apapa, Lagos</p>
          <p className="ex-footer__phone">
            +234 913 1701630
            <br />
            +234 815 8882242
          </p>
        </div>
      </div>

      <div className="ex-container ex-footer__bottom">
        <span>
          © {new Date().getFullYear()} Examible Technologies. All rights
          reserved.
        </span>
        <div className="ex-footer__legal">
          <Link to="/data-deletion">Privacy</Link>
          <Link to="/data-deletion">Data Deletion</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
