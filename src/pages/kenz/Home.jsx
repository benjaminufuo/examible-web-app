import "../../styles/landing.css";
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

const Home = () => {
  return (
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
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <Testimonials />
      <section id="pricing">
        <Pricing />
      </section>
      <FAQ />
      <FinalCTA />
    </div>
  );
};

export default Home;
