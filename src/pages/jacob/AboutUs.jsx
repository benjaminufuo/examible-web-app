import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import "../../styles/aboutus.css";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaSkype, FaYoutube } from "react-icons/fa";
import heroImg from "../../assets/public/heroimg1.png";
import target from "../../assets/public/targget.png";
import camera from "../../assets/public/sweemglasses.png";
import hand from "../../assets/public/hands.png";
import study1 from "../../assets/public/study1.png";
import study2 from "../../assets/public/study2.png";
import study3 from "../../assets/public/study3.png";
import study4 from "../../assets/public/study4.png";
import team1 from "../../assets/public/team1.png";
import team2 from "../../assets/public/team2.png";
import team3 from "../../assets/public/team3.png";
import team4 from "../../assets/public/team4.png";
import team5 from "../../assets/public/team5.jpg";
import team6 from "../../assets/public/team6.jpg";
import team7 from "../../assets/public/team7.jpg";
import { FaCheck } from "react-icons/fa6";
import ProvenProcess from "../../components/ProvenProcess";

const AboutUs = () => {
  const heroDescription = [
    {
      title: "Our Mission",
      text1:
        "To empower learners worldwide with accessible, high-quality, and flexible education.",
      text2:
        "We aim to bridge the gap between knowledge and opportunity by providing an interactive and engaging learning experience for all.",
      img: target,
    },
    {
      title: "Our vision",
      text1:
        "To be the leading e-learning platform transforms the way people learn, nmaking education affordable, personalized, and available anytime, anywhere.",
      text2:
        "We envision a world where anyone can acquire skills, grow professionally, and achieve their dreams through the power of digital learning.",
      img: camera,
    },
    {
      title: "Our core value",
      text1:
        "Accessibility – Education should be within reach for everyone, regardless of location or background",
      text2:
        "Innovation – We embrace technology to create engaging, effective, and modern learning experiences.",
      img: hand,
    },
  ];

  const leftthirdsection = [
    { image: study1 },
    { image: study2 },
    { image: study3 },
    { image: study4 },
  ];

  return (
    <main className="aboutUsMain">
      <section className="aboutUsContainer">
        <div className="heroSection">
          <div className="heroImgContainer">
            <img className="heroImg" src={heroImg} />
          </div>
          <div className="aboutdescription">
            <h1>
              Introduction to <em className="aboutem">Examible</em>
            </h1>
            <div className="heroline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="3"
                height="144"
                viewBox="0 0 3 144"
                fill="none"
              >
                <path d="M1.5 0V144" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <span>
              Examible is dedicated to helping students achieve their academic
              goals through, Mock Exams, Past Questions and expert guidance.
            </span>
          </div>
        </div>
        <div className="aboutstatements">
          {heroDescription.map((aboutcard, index) => (
            <motion.div
              className="aboutcard"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <h1>{aboutcard.title}</h1>
              <div className="innertext">
                <p>{aboutcard.text1}</p>
                <span>{aboutcard.text2}</span>
              </div>
              <div className="statementImg">
                <img className="" src={aboutcard.img} />
              </div>
            </motion.div>
          ))}
          <div className="eclipse"></div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;

const cardData = [
  {
    title:
      "Exam-Style Practice – Real CBT simulations ensure you're fully prepared.",
    showCircle: true,
  },
  {
    title:
      "Time Management Boost – Learn to answer questions under real exam conditions.",
    showCircle: true,
  },
  {
    title:
      "Performance Insights – Track progress, identify weak topics, and improve.",
    showCircle: true,
  },
  {
    title:
      "Stress-Free Learning – Reduce anxiety with structured practice and study tips.",
    showCircle: true,
  },
];
