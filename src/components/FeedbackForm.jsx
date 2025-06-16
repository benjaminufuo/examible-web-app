import { Rate } from "antd";
import "../styles/dashboardCss/feedbackForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setFeedbackModal, setUser } from "../global/slice";
import emailjs from "@emailjs/browser";
import { ClipLoader } from "react-spinners";
import axios from "axios";

const FeedbackForm = () => {
  const [showRatings, setShowRatings] = useState(true);
  const [starRatings, setStarRatings] = useState(0);
  const [ratings, setRatings] = useState("");
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const url = `https://legacybuilderbackend.onrender.com/api/v1/students/${user._id}/feedback`;

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
    setLoading(true);
    emailjs
      .send("service_5ou2b5r", "template_q90lk1j", formFilled, {
        publicKey: "wnutFCM-U192Bh14E",
      })
      .then(
        async () => {
          try {
            const res = await axios.put(url, {});
            console.log(res);
            if (res.status === 200) {
              toast.success("Thanks for the feedback", {
                autoClose: 2000,
              });
              setTimeout(() => {
                dispatch(setFeedbackModal());
                setTimeout(() => {
                  dispatch(setUser(res?.data?.data));
                }, 500);
                setLoading(false);
              }, 1000);
            }
          } catch (error) {
            console.log(error);
          }
        },
        (error) => {
          setLoading(false);
          toast.error(error.text, {
            autoClose: 2000,
          });
        }
      );
  };

  return (
    <div className="feedbackForm" onClick={() => dispatch(setFeedbackModal())}>
      <div className="feedbackForm-modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <button onClick={() => dispatch(setFeedbackModal())}>x</button>
        </header>
        {showRatings ? (
          <>
            <nav>
              <h2>How was your experience?</h2>
              <Rate
                allowHalf
                style={{ color: "gold", fontSize: 35 }}
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
              <button disabled={!message || loading} onClick={handleSend}>
                {loading ? <ClipLoader color="#804bf2" size={25} /> : "Send"}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
