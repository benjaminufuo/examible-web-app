import "../../styles/learnmore.css";
import learn1 from "../../assets/public/learn1.svg";
import learn2 from "../../assets/public/learn2.svg";
import learn3 from "../../assets/public/learn3.svg";
import learnimg4 from "../../assets/public/learnimg4.png";
import { FaCheck } from "react-icons/fa6";

import ProvenProcess from "../../components/ProvenProcess";

const LearnMore = () => {
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
  return (
    <main className="learnmoremain">
      <div className="learnmorecircle">
        <div className="innercircle"></div>
      </div>
      <div className="curvedpurpletop">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="546px"
          preserveAspectRatio="none"
          viewBox="0 0 1440 656"
          fill="none"
        >
          <path
            d="M1440 0H0V656C556.833 535.439 872.395 541.575 1440 656V0Z"
            fill="#804BF2"
          />
        </svg>
      </div>
      <div className="learnmorecontainer">
        <div className="learnmoreheader">
          <h1>
            Score <span style={{ color: "#f2ae30" }}>300+</span> in JAMB with
            Examible
          </h1>
          <p>
            Get the right resources, practice past questions, and track your
            progress to unlock your best JAMB score yet!
          </p>
        </div>
        <div className="learnmoreimage">
          <div className="learnimg1">
            <img src={learn1} />
          </div>
          <div className="learnimg2">
            <img src={learn2} />
          </div>
          <div className="learnimg3">
            <img src={learn3} />
          </div>
        </div>
        <div className="learnmoredescription">
          <p>
            Preparing for JAMB can be stressful, but with Examible, you get the
            right tools to study smarter, not harder. Our platform is designed
            to help you achieve your dream score with real mockup exams, past
            questions, and personalized study tracking.
          </p>
        </div>
        <div className="learnmoresecondheader">
          <h1>Examible</h1>
          <p>
            Examible is designed to help students score 300+ in JAMB with an
            efficient and engaging study experience.
          </p>
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
          <div className="keyfeatures">
            <div className="featurescontainer">
              <div className="lexftimgdiv">
                <img src={learnimg4} />
              </div>
              <div className="righttext">
                <div className="righttextheader">
                  <h1>
                    Examible
                    <span style={{ marginLeft: 10, color: "#804bf2" }}>
                      Key Features:
                    </span>
                  </h1>
                  <p>What Makes Examible Unique?</p>
                </div>
                <div className="righttextcontent">
                  <div className="firstcontent">
                    <ol>
                      <li className="firsttextone">
                        CBT Mock Exams with Real JAMB Interface
                      </li>
                    </ol>
                    <ul className="firsttexttwoholder">
                      <li className="firsttexttwo">
                        Simulate actual Mockup Exams (CBT) with a real exam-like
                        environment.
                      </li>
                      <li className="firsttexttwo">
                        Get instant results and insights into your performance.
                      </li>
                    </ul>
                  </div>
                  <div className="secondcontent">
                    <ol start={2}>
                      <li className="firsttextone">
                        Past Questions with Explanations
                      </li>
                    </ol>
                    <ul className="firsttexttwoholder">
                      <li className="firsttexttwo">
                        Access a large database of JAMB past questions across
                        all subjects.
                      </li>
                      <li className="firsttexttwo">
                        Detailed solutions help you understand mistakes and
                        improve.
                      </li>
                    </ul>
                  </div>
                  <div className="firstcontent">
                    <ol start={3}>
                      <li className="firsttextone">Student Tracker Board</li>
                    </ol>
                    <ul className="firsttexttwoholder">
                      <li className="firsttexttwo">
                        Monitor your progress with personalized performance
                        analytics.
                      </li>
                      <li className="firsttexttwo">
                        See subject strengths and weaknesses in an easy-to-read
                        dashboard.
                      </li>
                    </ul>
                  </div>
                  <div className="fourthcontent">
                    <ol start={4}>
                      <li className="firsttextone">
                        Gamified Learning with Rewards
                      </li>
                    </ol>
                    <ul className="firsttexttwoholder">
                      <li className="firsttexttwo">
                        Earn points, unlock achievements, and stay motivated
                        while studying.
                      </li>
                      <li className="firsttexttwo">
                        Compete with other students on leaderboards.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottomtext">
              <h1>
                Ready to Ace <span style={{ color: "#804bf2" }}>JAMB?</span>
              </h1>
              <p>
                Join thousands of students improving their scores with Exambile.
              </p>
            </div>
            <div className="learnmorefooter">
              <h1>
                Our Proven <span style={{ color: "#804bf2" }}>Process</span>
              </h1>
              <ProvenProcess />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LearnMore;
