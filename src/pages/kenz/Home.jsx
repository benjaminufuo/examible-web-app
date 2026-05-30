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
      <Hero />
      <TrustBar />
      <Features />
      <ProductPreview />
      <WhyExamible />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </div>
  );
};

export default Home;
