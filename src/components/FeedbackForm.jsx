import { Rate } from "antd";
import "../styles/dashboardCss/feedbackForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setFeedbackModal } from "../global/slice";
import emailjs from "@emailjs/browser";

const FeedbackForm = () => {
  const [showRatings, setShowRatings] = useState(true);
  const [starRatings, setStarRatings] = useState(0);
  const [ratings, setRatings] = useState("");
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleRateUs = () => {
    setRatings(`${(starRatings / 5) * 100}%`);
    setShowRatings(false);
  };

  const handleSend = () => {
    const formFilled = {
      fullName: user?.fullName,
      email: user?.email,
      ratings,
      message,
    };
    emailjs
      .send("service_5ou2b5r", "template_q90lk1j", formFilled, {
        publicKey: "wnutFCM-U192Bh14E",
      })
      .then(
        () => {
          toast.success("Thanks for the feedback", {
            autoClose: 2000,
          });
          setTimeout(() => {
            dispatch(setFeedbackModal());
          }, 1000);
        },
        (error) => {
          toast.error(error.text, {
            autoClose: 2000,
          });
        }
      );
  };

  return (
    <div className="feedbackForm">
      <div className="feedbackForm-modal">
        <header>
          <button onClick={() => dispatch(setFeedbackModal())}>x</button>
        </header>
        {showRatings ? (
          <>
            <nav>
              <h2>How was your experience?</h2>
              <Rate
                allowHalf
                style={{ color: "gold", fontSize: 40 }}
                onChange={(value) => setStarRatings(value)}
              />
            </nav>
            <footer>
              <button onClick={handleRateUs} disabled={starRatings <= 0}>
                Rate us
              </button>
            </footer>
          </>
        ) : (
          <>
            <main>
              <h3>Give Feedback</h3>
              <textarea
                value={message}
                placeholder="Share your thoughts with us about Examible"
                onChange={(e) => setMessage(e.target.value)}
              />
            </main>
            <footer>
              <button disabled={!message} onClick={handleSend}>
                Send
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
