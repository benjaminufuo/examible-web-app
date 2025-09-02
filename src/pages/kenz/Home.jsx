import "../../styles/home.css";
import home1 from "../../assets/public/home-firstlayer.png";
import home2 from "../../assets/public/home-secondLeft.png";
import home3 from "../../assets/public/home-jamb-syllabus.png";
import home4 from "../../assets/public/home-question.png";
import home5 from "../../assets/public/home-badges.png";
import home6 from "../../assets/public/home-mock-exam.jpg";
import home7 from "../../assets/public/home-past-question.png";
import home8 from "../../assets/public/chat-bot.jpg";
import home9 from "../../assets/public/home-victoria.jpg";
import home10 from "../../assets/public/home-kenneth.jpg";
import home12 from "../../assets/public/home-augustine.jpg";
import home13 from "../../assets/public/home-lola.jpg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router-dom";
import { Rate } from "antd";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 769 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 769, min: 0 },
    items: 1,
  },
};

const usersFeedback = [
  {
    feedback:
      "I was unsure if I could get 250 or above in JAMB. Examibles’ quizzes, study guides, helped me a lot. My score of 265 exceeded my expectations.",
    name: "Tolu",
    school: "University of Ibadan",
    image: home13,
    ratings: 5,
  },
  {
    feedback:
      "I thought getting 250+ in JAMB was impossible for me. But Examible gave me the resources, mock tests, and motivation I needed. The practice quizzes helped me prepare and I scored 305.",
    name: "Emeka",
    school: "University of Lagos",
    image: home12,
    ratings: 4,
  },
  {
    feedback:
      "I thought getting 250+ in JAMB was impossible for me. But Examible gave me the resources, mock tests, and motivation I needed. The practice quizzes helped me prepare and I scored 305.",
    name: "Miracle",
    school: "University of Lagos",
    image: home10,
    ratings: 4.5,
  },
  {
    feedback:
      "I thought getting 250+ in JAMB was impossible for me. But Examible gave me the resources, mock tests, and motivation I needed. The practice quizzes helped me prepare and I scored 305.",
    name: "Esther",
    school: "University of Lagos",
    image: home9,
    ratings: 5,
  },
];

const Home = () => {
  const nav = useNavigate();
  return (
    <div className="home">
      <div className="home-firstLayer">
        <div className="home-firstLayerCircle">
          <aside />
        </div>
        <div className="home-firstLayerSmallCircle"></div>
        <div className="home-firstLayerHolder">
          <main>
            <section>
              <h5>
                Score <span style={{ color: "#804BF2" }}>300+</span> in JAMB
                with Examible
              </h5>
              <p>
                Get the right resources, practice past questions, and track your
                progress to unlock your best JAMB score yet!
              </p>
            </section>
            <button onClick={() => nav("/signup")}>GET STARTED</button>
          </main>
          <nav>
            <aside>
              <div />
            </aside>
            <article />
            <img src={home1} alt="Educational aspirant" />
          </nav>
        </div>
      </div>
      <div className="home-secondLayer">
        <div className="home-secondLayerLeft">
          <div className="home-secondLayerLeftCircle"></div>
          <img src={home2} alt="" />
          <aside />
        </div>
        <div className="home-secondLayerRight">
          <h3>
            Why <span style={{ color: "#804BF2" }}>Choose</span> us
          </h3>
          <main>
            <article>
              <img
                src={home3}
                alt="Jamb Syllabus"
                style={{ height: 83, width: 83 }}
              />
              <img
                src={home4}
                alt="Question bank"
                style={{ height: 85, width: 127.8 }}
              />
              <img src={home5} alt="Badges" style={{ height: 90, width: 90 }} />
            </article>
            <section>
              <div>
                <h6>Structured Jamb Syllabus </h6>
                <p>
                  Each topic is designed to cover the foundational knowledge
                  that will be examined in the JAMB.
                </p>
              </div>
              <aside>
                <h6>Unlimited question bank</h6>
                <p>
                  These questions cover all the topics in the syllabus and help
                  students test their knowledge, improve their understanding,
                  and get ready for the actual exam.
                </p>
              </aside>
              <nav>
                <h6>Badges for top students</h6>
                <p>
                  Top students earn these badges to show off their
                  accomplishments.
                </p>
              </nav>
            </section>
          </main>
        </div>
      </div>
      <div className="home-thirdLayer">
        <aside>
          <article>
            <h6>2653</h6>
            <p>Students Registered</p>
          </article>
        </aside>
        <div className="home-thirdLayerHolder">
          <h3>Our Stats</h3>
          <nav></nav>
          <div>
            <h6>1530</h6>
            <p>Students scored 300+ above</p>
          </div>
          <div>
            <h6>773</h6>
            <p>Students scored 250+ above</p>
          </div>
          <div>
            <h6>350</h6>
            <p>Students scored 250 & below</p>
          </div>
        </div>
      </div>
      <div className="home-fourthLayer">
        <h6>
          Our <span style={{ color: "#804BF2" }}>Key</span> Features
        </h6>
        <p>Explore our Key features with Ease</p>
      </div>
      <div className="home-fifthLayer">
        <nav>
          <div>
            <img src={home6} alt="Mock Exam" />
          </div>
          <p>Mock Exam</p>
        </nav>
        <nav>
          <div>
            <img src={home7} alt="Past Question" />
          </div>
          <p>Past Question</p>
        </nav>
        <nav>
          <div>
            <img src={home8} alt="Legacy Bot" />
          </div>
          <p>Examible Bot</p>
        </nav>
      </div>
      <div className="home-sixthLayer">
        <h3>
          Progress <span style={{ color: "#804BF2" }}>Tracker</span>
        </h3>
        <div className="home-sixthLayerHolder">
          <main></main>
          <nav>
            <h4>Feeling Overwhelmed?</h4>
            <h6>
              Many students have felt just like you and still went on to score
              above 250 in JAMB. They faced the same challenges, but with the
              right steps, they made it. Just like them, you too can take these
              steps and achieve greater results.
            </h6>
            <ul>
              <li>
                <span style={{ fontWeight: 700 }}>Stay focused:</span> One step
                at a time, one topic at a time.
              </li>
              <li>
                <span style={{ fontWeight: 700 }}>Practice regularly:</span>{" "}
                Mock exams help you improve.
              </li>
              <li>
                <span style={{ fontWeight: 700 }}>Believe in yourself:</span>{" "}
                Trust that you can do this, and the results will follow
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="home-eightLayer">
        <h5>TESTIMONIES</h5>
        <h6>
          What our <span style={{ color: "#804BF2" }}>users are saying</span>{" "}
          about us.
        </h6>
      </div>
      <div className="home-nineLayer">
        <Carousel
          responsive={responsive}
          swipeable={true}
          draggable={true}
          showDots={false}
          ssr={true}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={8000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {usersFeedback?.map((item, index) => (
            <div className="home-nineLayerHolder" key={index}>
              <h3>“</h3>
              <p>{item?.feedback}</p>
              <nav>
                <div className="nineLayerHolder-div">
                  <div>
                    <img src={item?.image} alt="" />
                  </div>
                  <h6>{`${item?.name} (${item?.school})`} </h6>
                </div>
                <article>
                  <Rate
                    style={{
                      width: "100%",
                      fontSize: "17px",
                      color: "#804BF2",
                    }}
                    disabled
                    allowHalf
                    defaultValue={item?.ratings}
                  />
                </article>
              </nav>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
