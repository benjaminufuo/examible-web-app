import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "../styles/legal.css";

const TermsOfService = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms of Service — Examible</title>
        <meta name="description" content="Review the terms and conditions governing your use of Examible's exam preparation platform." />
        <link rel="canonical" href="https://examible.com/terms-of-service" />
      </Helmet>
    <div className="legal-page-wrapper">
      <div className="legal-page-container">
        <div className="legal-page-header">
          <button onClick={() => handleBack(-1)} className="legal-back-btn">
            <FiArrowLeft /> Back
          </button>
          <h1>Terms of Service</h1>
          <p className="legal-last-updated">
            <strong>Effective Date:</strong> 17th July, 2026 <br />
            <strong>Last Updated:</strong> 17th July, 2026
          </p>
        </div>

        <div className="legal-page-content">
          <p>
            Welcome to <strong>Examible Technologies</strong>. These Terms of
            Service ("Terms") govern your access to and use of the Examible
            platform.
          </p>
          <p>By accessing or using Examible, you agree to these Terms.</p>

          <hr />

          <h2>1. About Examible</h2>
          <p>
            Examible Technologies provides digital educational services
            including:
          </p>
          <ul>
            <li>JAMB CBT simulations</li>
            <li>Practice examinations</li>
            <li>Past questions</li>
            <li>AI-assisted learning</li>
            <li>Study analytics</li>
            <li>Premium educational subscriptions</li>
          </ul>

          <h2>2. Eligibility</h2>
          <p>
            You must provide accurate information when creating an account. If
            you are under the age required by applicable law to enter into
            binding agreements, you should use the Platform under the
            supervision of a parent or guardian.
          </p>

          <h2>3. User Accounts</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account.</li>
            <li>Keeping your password secure.</li>
            <li>Ensuring the accuracy of your information.</li>
            <li>All activities carried out using your account.</li>
          </ul>
          <p>
            You must notify us immediately if you suspect unauthorized access to
            your account.
          </p>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Share your account credentials.</li>
            <li>Attempt unauthorized access to our systems.</li>
            <li>Reverse engineer or copy our software.</li>
            <li>Use automated tools to scrape content.</li>
            <li>Upload malicious software.</li>
            <li>Interfere with the Platform's operation.</li>
            <li>Misuse AI-powered educational features.</li>
          </ul>
          <p>
            Violation of these rules may result in suspension or termination of
            your account.
          </p>

          <h2>5. Subscriptions and Payments</h2>
          <p>
            Examible offers both free and premium subscription plans. Payments
            are securely processed through <strong>KoraPay</strong>,{" "}
            <strong>Opay</strong> and <strong>Paystack</strong>. Subscription
            fees are displayed before payment and are subject to change with
            reasonable notice. Unless otherwise stated, subscription fees are
            non-refundable except where required by applicable law.
          </p>

          <h2>6. Educational Content</h2>
          <p>
            Examible provides educational resources for learning and examination
            preparation. While we strive to ensure the accuracy and quality of
            our materials, we do not guarantee examination success, admission
            into any institution, or specific academic outcomes.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            All content on the Platform, including but not limited to software,
            user interface designs, logos, branding, graphics, educational
            materials, text, and images is owned by or licensed to Examible
            Technologies and is protected by applicable intellectual property
            laws. You may not reproduce, distribute, modify, or commercially
            exploit any content without our prior written permission.
          </p>

          <h2>8. Availability of Services</h2>
          <p>
            We strive to provide uninterrupted access to the Platform. However,
            services may occasionally be unavailable due to maintenance,
            technical issues, system upgrades, internet disruptions, or events
            beyond our reasonable control. We are not liable for temporary
            interruptions.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Examible Technologies shall
            not be liable for loss of data, loss of profits, examination
            outcomes, technical failures beyond our control, or indirect or
            consequential damages arising from the use of the Platform.
          </p>

          <h2>10. Account Suspension and Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these Terms, engage in fraudulent activities, misuse the Platform,
            attempt unauthorized access, or engage in activities that compromise
            the integrity or security of Examible.
          </p>

          <h2>11. Changes to the Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the
            Platform after updates constitutes acceptance of the revised Terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and interpreted in accordance with
            the laws of the <strong>Federal Republic of Nigeria</strong>,
            without regard to conflict of law principles.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            For questions regarding these Terms, please contact:
            <br />
            <strong>Examible Technologies</strong>
            <br />
            Email: <a href="mailto:info@examible.com">info@examible.com</a>
            <br />
            Website: <a href="https://www.examible.com">www.examible.com</a>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default TermsOfService;
