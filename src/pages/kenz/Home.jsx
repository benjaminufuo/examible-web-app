import "../../styles/landing.css";
import { Helmet } from "react-helmet-async";
import Hero from "../../components/landing/Hero";
import TrustBar from "../../components/landing/TrustBar";
import Features from "../../components/landing/Features";
import ProductPreview from "../../components/landing/ProductPreview";
import WhyExamible from "../../components/landing/WhyExamible";
import HowItWorks from "../../components/landing/HowItWorks";
import Testimonials from "../../components/landing/Testimonials";
import Pricing from "../../components/landing/Pricing";
import FAQ from "../../components/landing/FAQ";
import FinalCTA from "../../components/landing/FinalCTA";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Examible",
  url: "https://examible.com",
  logo: "https://res.cloudinary.com/dltjsi3xx/image/upload/v1781513015/logo_msufwd.png",
  description:
    "AI-powered CBT exam preparation for JAMB, WAEC, and NECO. Realistic simulations, past questions, and personalised analytics for students across Africa.",
  sameAs: [
    "https://www.facebook.com/examible",
    "https://www.instagram.com/examible",
    "https://www.linkedin.com/company/examible",
  ],
  offers: {
    "@type": "Offer",
    category: "Educational Service",
    eligibleRegion: {
      "@type": "Country",
      name: "Nigeria",
    },
  },
};

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Examible — AI-Powered CBT Exam Prep for JAMB, WAEC &amp; NECO</title>
        <meta
          name="description"
          content="Prepare smarter with realistic CBT simulations, a personal AI tutor, and past questions for JAMB, WAEC, and NECO. Join 2,600+ students acing their exams."
        />
        <link rel="canonical" href="https://examible.com/" />
        <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      </Helmet>
    <div className="ex-landing">
      <section id="home">
        <Hero />
      </section>
      <TrustBar />
      <section id="user-prep">
        <Features />
        <ProductPreview />
        <WhyExamible />
      </section>
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </div>
    </>
  );
};

export default Home;
