import React from "react";
import "../../styles/learnmore.css";
import learnimg1 from "../../assets/public/learnimg1.png";
import learnimg2 from "../../assets/public/learnimg2.png";
import learnimg3 from "../../assets/public/learnimg3.png";
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
          height="102vh"
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
            Score <span className="threehundredplus">300+</span> in JAMB with
            Legacy Builders
          </h1>
          <p>
            Get the right resources, practice past questions, and track your
            progress to unlock your best JAMB score yet!
          </p>
        </div>
        <div className="learnmoreimage">
          <div className="learnimg1">
            <img src={learnimg1} className="learnmorepicssame" />
          </div>
          <div className="learnimg2">
            <img src={learnimg2} className="learnmorepics" />
          </div>
          <div className="learnimg3">
            <img src={learnimg3} className="learnmorepicssame" />
          </div>
        </div>
        <div className="learnmoredescription">
          <span>
            Preparing for JAMB can be stressful, but with Legacy Builder, you
            get the right tools to study smarter, not harder. Our platform is
            designed to help you achieve your dream score with real mockup
            exams, past questions, and personalized study tracking.
          </span>
        </div>
        <div className="learnmoresecondheader">
          <h1>Legacy Builders</h1>
          <span>
            Legacy Builder is designed to help students score 300+ in JAMB with
            an efficient and engaging study experience.
          </span>
        </div>

        <div className="smartpreparation">
          <div className="smartheader">
            <h1>
              Faster & Smarter <span className="preparation">Preparation</span>
            </h1>
            <span>No more aimless studying; focus on what truly matters.</span>
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
                <span>{card.title}</span>
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
                    Legacy builders
                    <em className="purplefeatures">Key Features:</em>
                  </h1>
                  <span>What Makes Legacy Builder Unique?</span>
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
                Ready to Ace <em className="learnmorejamb">JAMB?</em>
              </h1>
              <span>
                Join thousands of students improving their scores with Legacy
                Builder.
              </span>
            </div>
            <div className="learnmorefooter">
              <h1>
                Our Proven <em className="process">Process</em>
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
