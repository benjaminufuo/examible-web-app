import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import "../../styles/aboutus.css";
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
            <div className="aboutcard" key={index}>
              <h1>{aboutcard.title}</h1>
              <div className="innertext">
                <p>{aboutcard.text1}</p>
                <span>{aboutcard.text2}</span>
              </div>
              <div className="statementImg">
                <img className="" src={aboutcard.img} />
              </div>
            </div>
          ))}
          <div className="eclipse"></div>
        </div>
        <div className="aboutthirdsection">
          <div className="leftthirdsection">
            {leftthirdsection.map((images, index) => (
              <div className="leftcard" key={index}>
                <img src={images.image} />
              </div>
            ))}
          </div>
          <div className="rightthirdsection">
            <h1>
              Examible Your Ultimate Platform for{" "}
              <em className="emsucces">JAMB Success!</em>
            </h1>
            <div className="aboutstudytext">
              <p>
                Examible offers a comprehensive and study experience,
                <br /> providing you with past questions, personalized quizzes,
                <br />
                real-time progress tracking, and expert assistance.
              </p>
              <span>
                All designed to help you excel in your JAMB exams,
                <br />
                boost your knowledge, and increase your chances
                <br />
                of scoring 300+.
              </span>
            </div>
          </div>
          <div className="aboutcircle">
            <div className="aboutinnercircle"></div>
          </div>
          <div className="aboutcircle1">
            <div className="aboutinnercircle1"></div>
          </div>
          <div className="aboutpurplesmallcircle1"></div>
          <div className="aboutgoldsmallcircle1"></div>
          <div className="aboutpurplesmallcircle"></div>
        </div>
        <div className="bottomheader">
          <h1>
            Team <em>Members</em>
          </h1>
          <span>
            Our diverse team brings expertise from various fields to create an
            engaging, accessible, and high-quality learning experience for
            students worldwide.
          </span>
        </div>
        <div className="teamcarousel">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={4}
            autoplay={{
              disableOnInteraction: false,
            }}
            breakpoints={{
              1024: { slidesPerView: 4 },
              768: { slidesPerView: 3 },
              320: { slidesPerView: 3 },
            }}
            speed={8000}
            loop={true}
          >
            <SwiperSlide>
              <div className="teamdiv">
                <img src={team1} />
                <div className="aboutname">
                  <h1>Victoria Godwin</h1>
                  <span>Product Designer</span>
                </div>
                <div className="role">
                  <div className="abouticons">
                    <FaFacebook className="aboutmaiinicon" />
                    <FaTwitter className="aboutmaiinicon" />
                    <FaSkype className="aboutmaiinicon" />
                    <FaYoutube className="aboutmaiinicon" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="teamdiv">
                <img src={team2} />
                <div className="aboutname">
                  <h1>George Godonou</h1>
                  <span>Product Designer</span>
                </div>
                <div className="role">
                  <div className="abouticons">
                    <FaFacebook className="aboutmaiinicon" />
                    <FaTwitter className="aboutmaiinicon" />
                    <FaSkype className="aboutmaiinicon" />
                    <FaYoutube className="aboutmaiinicon" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="teamdiv">
                <img src={team3} />
                <div className="aboutname">
                  <h1>Benjamin Ufoma</h1>
                  <span>Frontend Developer</span>
                </div>
                <div className="role">
                  <div className="abouticons">
                    <FaFacebook className="aboutmaiinicon" />
                    <FaTwitter className="aboutmaiinicon" />
                    <FaSkype className="aboutmaiinicon" />
                    <FaYoutube className="aboutmaiinicon" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="teamdiv">
                <img src={team4} />
                <div className="aboutname">
                  <h1>Lola Amos</h1>
                  <span>Frontend Developer</span>
                </div>
                <div className="role">
                  <div className="abouticons">
                    <FaFacebook className="aboutmaiinicon" />
                    <FaTwitter className="aboutmaiinicon" />
                    <FaSkype className="aboutmaiinicon" />
                    <FaYoutube className="aboutmaiinicon" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="teamdiv">
                <img src={team5} />
                <div className="aboutname">
                  <h1>Augustine Okoye</h1>
                  <span>Frontend Developer</span>
                </div>
                <div className="role">
                  <div className="abouticons">
                    <FaFacebook className="aboutmaiinicon" />
                    <FaTwitter className="aboutmaiinicon" />
                    <FaSkype className="aboutmaiinicon" />
                    <FaYoutube className="aboutmaiinicon" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="teamdiv">
                <img src={team6} />
                <div className="aboutname">
                  <h1>Kenneth Ukunwanne</h1>
                  <span>Backend Developer</span>
                </div>
                <div className="role">
                  <div className="abouticons">
                    <FaFacebook className="aboutmaiinicon" />
                    <FaTwitter className="aboutmaiinicon" />
                    <FaSkype className="aboutmaiinicon" />
                    <FaYoutube className="aboutmaiinicon" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="teamdiv">
                <img src={team7} />
                <div className="aboutname">
                  <h1>Aimudo Anthony</h1>
                  <span>Backend Developer</span>
                </div>
                <div className="role">
                  <div className="abouticons">
                    <FaFacebook className="aboutmaiinicon" />
                    <FaTwitter className="aboutmaiinicon" />
                    <FaSkype className="aboutmaiinicon" />
                    <FaYoutube className="aboutmaiinicon" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="smartpreparation">
          <div className="smartheader">
            <h1>
              Faster & Smarter{" "}
              <span style={{ color: "#804bf2" }}>Preparation</span>
            </h1>
            <p>No more aimless studying; focus on what truly matters.</p>
          </div>

          <div className="carddata">
            {cardData.map((card, index) => (
              <div className="card" key={index}>
                {card.showCircle && (
                  <div className="whitecircle">
                    <div className="innerpurplecircle">
                      <FaCheck className="checkicon" />
                    </div>
                  </div>
                )}
                <p>{card.title}</p>
              </div>
            ))}
          </div>
        </div>
        <ProvenProcess />
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
