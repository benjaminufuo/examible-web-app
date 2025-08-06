// import  Navbar  from "../../components/Navbar";
// import Footer from "../../components/Footer";
import "../../styles/proctor.css";
import { AiOutlineCamera, AiOutlineDesktop, AiOutlineAudio, AiOutlineFileText, AiOutlineSafetyCertificate } from "react-icons/ai";
import { FaGraduationCap } from "react-icons/fa";

const ProctorPage = () => {
  return (
    <>
      {/* <Navbar /> */}
      <main>
        {/* Hero Section */}
        <section className="hero-section animate-fade-in-up">
          <div className="hero-text">
            <h1 className="animate-slide-in-left">ProctorPlus: Smart Remote Proctoring</h1>
            <p className="animate-slide-in-left delay-100">AI-powered proctoring to ensure exam integrity for schools, organizations, and platforms. Secure your assessments with intelligent, real-time monitoring.</p>
            <a href="https://proctor-plus-murex.vercel.app/" className="button animate-slide-in-left delay-200">
              Visit ProctorPlus Website
            </a>
          </div>
          <div className="hero-image-wrapper animate-fade-in-scale">
            <img
              src="https://placehold.co/1200x600/E0E7FF/3F51B5?text=ProctorPlus+Dashboard"
              alt="AI-powered remote proctoring dashboard"
              width={1200}
              height={600}
              className="hero-image"
            />
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="section feature-grid-section">
          <div className="container">
            <h2 className="section-title animate-fade-in-up">How ProctorPlus Works</h2>
            <p className="section-subtitle animate-fade-in-up delay-100">
              Leveraging cutting-edge AI, ProctorPlus provides a seamless and secure proctoring experience, ensuring fairness and integrity for every assessment.
            </p>
            <div className="feature-grid">
              <div className="feature-card animate-fade-in-up delay-200">
                <AiOutlineCamera className="icon" />
                <h3>Live Webcam Monitoring</h3>
                <p>AI-driven facial recognition and gaze tracking provide real-time student monitoring, flagging suspicious activities instantly.</p>
              </div>
              <div className="feature-card animate-fade-in-up delay-300">
                <AiOutlineDesktop className="icon" />
                <h3>Screen Lock + Recording</h3>
                <p>Securely locks down the exam environment, preventing unauthorized applications and capturing all on-screen activity for review.</p>
              </div>
              <div className="feature-card animate-fade-in-up delay-400">
                <AiOutlineAudio className="icon" />
                <h3>Advanced Audio Detection</h3>
                <p>Intelligent audio analysis detects background noise, conversations, and other anomalies, providing comprehensive integrity checks.</p>
              </div>
              <div className="feature-card animate-fade-in-up delay-500">
                <AiOutlineFileText className="icon" />
                <h3>Automated Violation Reports</h3>
                <p>Generates detailed, time-stamped reports with flagged incidents, making review efficient and actionable for administrators.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Alternating Content Sections */}
        <section className="section alternating-content-section">
          <div className="container">
            <h2 className="section-title animate-fade-in-up">Who Benefits from ProctorPlus?</h2>
            <p className="section-subtitle animate-fade-in-up delay-100">
              ProctorPlus is engineered to serve diverse needs, from academic institutions to corporate environments, ensuring integrity across all online assessments.
            </p>

            <div className="content-block animate-fade-in-up">
              <div className="content-text">
                <h3>For Academic Institutions</h3>
                <p>Safeguard the integrity of online exams and maintain academic standards. ProctorPlus helps universities and schools ensure fair testing conditions, reduce cheating, and uphold the value of their certifications and degrees. Our solution integrates seamlessly with existing learning management systems.</p>
                <a href="https://proctor-plus-murex.vercel.app/" className="button-secondary">
                  Learn more for Education
                </a>
              </div>
              <img
                src="https://placehold.co/600x400/E0E7FF/3F51B5?text=Students+Taking+Exam"
                alt="Students taking online exam"
                width={600}
                height={400}
                className="content-image"
              />
            </div>

            <div className="content-block reverse gray-bg animate-fade-in-up delay-100">
              <div className="content-text">
                <h3>For Enterprises and Organizations</h3>
                <p>Ensure the credibility of recruitment tests, certification programs, and internal compliance exams. ProctorPlus provides a secure and reliable platform for validating skills and knowledge, protecting your organization's reputation and ensuring fair hiring practices.</p>
                <a href="https://proctor-plus-murex.vercel.app/" className="button-secondary">
                  Learn more for Business
                </a>
              </div>
              <img
                src="https://placehold.co/600x400/E0E7FF/3F51B5?text=Professional+Exam"
                alt="Professional taking online certification exam"
                width={600}
                height={400}
                className="content-image"
              />
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section animate-fade-in-up">
          <div className="container">
            <h2 className="animate-fade-in-up">Ready to Secure Your Online Assessments?</h2>
            <p className="animate-fade-in-up delay-100">Discover how ProctorPlus can transform your exam integrity with intelligent, reliable, and scalable proctoring solutions.</p>
            <a href="https://proctor-plus-murex.vercel.app/" className="button animate-fade-in-up delay-200">
              Get Started with ProctorPlus
            </a>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default ProctorPage;
