import { useEffect } from "react";
import "../styles/dashboardCss/airesponse.css";
import { useDispatch, useSelector } from "react-redux";
import { setAiResponseModal } from "../global/slice";
import { BiArrowBack } from "react-icons/bi";
import handwave from "../assets/public/fluent_hand-wave-16-filled.svg";
import FormattedResponse from "./FormattedResponse";

const AiResponse = () => {
  const dispatch = useDispatch();
  const aiResponseModal = useSelector((state) => state.aiResponseModal);
  const AIresponse = useSelector((state) => state.AIresponse);

  useEffect(() => {
    document.body.style.overflow = aiResponseModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aiResponseModal]);

  const longText =
    "The **total number of bones in a typical adult human body is 206**. However, this number can vary slightly due to individual differences, such as:\n\n1.  **Age:** Newborns have around **270 bones**. Many bones (like those in the skull, spine, and pelvis) gradually fuse together as a child grows. This fusion process typically finishes in a person's mid-to-late 20s.\n2.  **Anatomical Variations:** Some people have extra bones (e.g., accessory ossicles in the foot/ankle or an extra rib) or fewer bones (e.g., fusion of adjacent bones).\n\nHere's a quick breakdown by region:\n\n*   **Skull:** 22 bones (includes cranial and facial bones, excluding ear ossicles).\n*   **Middle Ear Ossicles:** 6 bones (3 in each ear: malleus, incus, stapes).\n*   **Hyoid Bone:** 1 bone (in the neck).\n*   **Vertebral Column:** 26 bones (24 vertebrae, Sacrum, Coccyx).\n*   **Thoracic Cage:** 25 bones (24 ribs, 1 Sternum).\n*   **Pectoral Girdles:** 4 bones (2 scapulae, 2 clavicles).\n*   **Upper Limbs:** 60 bones (30 per arm: Humerus, Radius, Ulna, Carpals x8, Metacarpals x5, Phalanges x14).\n*   **Pelvic Girdle:** 2 bones (Hip bones - each formed from 3 fused bones: Ilium, Ischium, Pubis).\n*   **Lower Limbs:** 60 bones (30 per leg: Femur, Patella, Tibia, Fibula, Tarsals x7, Metatarsals x5, Phalanges x14).\n\n**Key Points:**\n\n*   **Infant/Child Count:** ~270 bones at birth.\n*   **Stable Adult Count:** ~206 bones (usually reached by mid-20s).\n*   **Possible Adult Variation:** Most adults are very close to 206, but the number can range roughly from **200 to 210** due to the factors mentioned.\n\nThis count is based on widely accepted anatomical references like *Gray's Anatomy* and standard medical education sources.";
  return (
    <main
      className="modal-overlay"
      onClick={() => dispatch(setAiResponseModal())}
    >
      <section className="ai-response-main-container">
        <header className="response-header">
          Study Time
          <BiArrowBack
            className="close-respone-modal"
            style={{ zIndex: 3, cursor: "pointer" }}
            onClick={() => dispatch(setAiResponseModal())}
          />
          <div className="second-header">
            <span className="second-header-text">
              Hi! Let help You with the explanation
            </span>
            <img src={handwave} />
          </div>
        </header>

        <div className="response-window">
          <div className="empty-space"></div>
          <div className="response-text">
            <FormattedResponse response={AIresponse} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AiResponse;
