import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "../styles/legal.css";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleBack = (step) => {
    navigate(-step);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page-wrapper">
      <div className="legal-page-container">
        <div className="legal-page-header">
          <button onClick={() => handleBack(1)} className="legal-back-btn">
            <FiArrowLeft /> Back
          </button>
          <h1>Privacy Policy</h1>
          <p className="legal-last-updated">
            <strong>Effective Date:</strong> 17th July, 2026 <br />
            <strong>Last Updated:</strong> 17th July, 2026
          </p>
        </div>

        <div className="legal-page-content">
          <p>
            Welcome to <strong>Examible Technologies</strong> ("Examible", "we",
            "our", or "us"). Your privacy is important to us. This Privacy
            Policy explains how we collect, use, disclose, and protect your
            information when you use our website, mobile applications, and
            educational services (collectively, the "Platform").
          </p>
          <p>
            By using Examible, you agree to the practices described in this
            Privacy Policy.
          </p>

          <hr />

          <h2>1. About Examible</h2>
          <p>
            Examible Technologies is an educational technology company dedicated
            to helping students prepare for examinations through interactive
            learning, CBT simulations, past questions, AI-powered study
            assistance, and personalized performance analytics.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>When you create an account, we may collect:</p>
          <ul>
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Username</li>
            <li>Password (encrypted)</li>
          </ul>

          <h3>Learning Information</h3>
          <p>To improve your learning experience, we collect:</p>
          <ul>
            <li>Subject selections</li>
            <li>Mock examination attempts</li>
            <li>CBT examination results</li>
            <li>Practice history</li>
            <li>Performance reports</li>
            <li>Study progress</li>
            <li>Time spent on learning activities</li>
            <li>Accuracy statistics</li>
          </ul>

          <h3>Device Information</h3>
          <p>We may automatically collect:</p>
          <ul>
            <li>Browser type</li>
            <li>Device type</li>
            <li>Operating system</li>
            <li>IP address</li>
            <li>Log information</li>
            <li>Session information</li>
          </ul>

          <h3>Payment Information</h3>
          <p>
            Examible offers Premium subscriptions plans, and payments are
            securely processed through <strong>KoraPay</strong>,{" "}
            <strong>Opay</strong> and <strong>Paystack</strong>.
          </p>
          <p>
            When you make a payment, your payment information is processed
            directly by the selected payment provider in accordance with their
            own privacy and security policies.
          </p>
          <p>
            Examible does <strong>not</strong> store your debit or credit card
            details, credit card, PIN, CVV or other sensitive payment
            credenytials on our servers. Payment information is securely
            processed by KoraPay in accordance with their privacy and security
            standards.
          </p>
          <p>
            We may receive limited transaction information from these payment
            providers, such as:
          </p>
          <ul>
            <li>Transaction reference</li>
            <li>Payment status</li>
            <li>Amount paid</li>
            <li>Payment date</li>
            <li>Payment method</li>
            <li>Subscription purchase</li>
          </ul>
          <p>
            This information is used solely to verify payments, activate
            subscriptions, maintain transaction history, provide customer
            support, and comply with applicable legal and financial obligations.
          </p>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Deliver educational content.</li>
            <li>Personalize your learning experience.</li>
            <li>Generate performance reports.</li>
            <li>Recommend study materials.</li>
            <li>Process subscriptions.</li>
            <li>Improve our services.</li>
            <li>Respond to customer support requests.</li>
            <li>Prevent fraud and unauthorized access.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2>4. Cookies and Similar Technologies</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Keep you logged in.</li>
            <li>Remember your preferences.</li>
            <li>Improve website performance.</li>
            <li>Analyze platform usage.</li>
            <li>Enhance user experience.</li>
          </ul>
          <p>
            You may disable cookies through your browser settings; however, some
            features may not function properly.
          </p>

          <h2>5. Sharing of Information</h2>
          <p>
            We do not sell your personal information. We may share information
            with trusted service providers who assist us in operating the
            Platform, including:
          </p>
          <ul>
            <li>KoraPay Opay and Paystack (Payment Processing)</li>
            <li>Cloud hosting providers</li>
            <li>Analytics providers</li>
            <li>Email communication services</li>
          </ul>
          <p>
            These providers are required to protect your information and use it
            only for the services they provide.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We implement reasonable technical and organizational measures to
            safeguard your information, including:
          </p>
          <ul>
            <li>Secure HTTPS connections</li>
            <li>Password encryption</li>
            <li>Access controls</li>
            <li>Secure servers</li>
            <li>Regular security monitoring</li>
          </ul>
          <p>
            While we strive to protect your information, no online system is
            completely secure.
          </p>

          <h2>7. Your Rights</h2>
          <p>Depending on applicable law, you may have the right to:</p>
          <ul>
            <li>Access your personal information.</li>
            <li>Update or correct inaccurate information.</li>
            <li>Request deletion of your account.</li>
            <li>Request a copy of your personal data.</li>
            <li>Withdraw consent where applicable.</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information
            provided below.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Examible provides educational services that may be used by students
            under the age of 18. Where required by applicable law, we encourage
            parents or guardians to supervise their children's use of the
            Platform. We do not knowingly collect personal information from
            children in violation of applicable laws.
          </p>

          <h2>9. Data Retention</h2>
          <p>
            We retain your information only for as long as necessary to provide
            our services, maintain educational records, comply with legal
            obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2>10. Third-Party Links</h2>
          <p>
            Our Platform may contain links to third-party websites or services.
            We are not responsible for the privacy practices of third-party
            websites.
          </p>

          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When
            significant changes are made, we will update the "Last Updated" date
            and notify users where appropriate.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact:
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
  );
};

export default PrivacyPolicy;
