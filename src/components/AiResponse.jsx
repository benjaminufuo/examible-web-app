import React, { useEffect } from "react";
import "../styles/dashboardCss/airesponse.css";
import { useDispatch, useSelector } from "react-redux";
import { setAiResponseModal } from "../global/slice";
import { BiArrowBack } from "react-icons/bi";
import handwave from "../assets/public/fluent_hand-wave-16-filled.svg";

const AiResponse = () => {
  const dispatch = useDispatch();
  const aiResponseModal = useSelector((state) => state.aiResponseModal);

  useEffect(() => {
    document.body.style.overflow = aiResponseModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aiResponseModal]);
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
          <p className="response-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio nisi
            animi distinctio nobis nostrum, deserunt ab natus ipsam consequatur
            praesentium dignissimos temporibus id quam, possimus molestiae nam.
            Ducimus, atque impedit? Dignissimos sunt reprehenderit sit
            aspernatur asperiores itaque iure, sapiente blanditiis esse
            veritatis minus, magnam voluptatem id voluptas odio mollitia
            quibusdam recusandae. Reprehenderit molestias at nihil deserunt,
            obcaecati cupiditate reiciendis veniam. Laborum ipsa fugit est eaque
            magnam consectetur, nisi obcaecati omnis blanditiis. Recusandae
            nobis sequi, aliquam magnam consectsetetur omnis necessitatibus hic
            obcaecati optio, rem nostrum asperiores et alias quisquam sint
            pariatur. Quis, tempora aspernatur? Aliquid cumque corrupti eum!
            Mollitia ullam quasi beatae? Ad, expedita et! Magni unde sint odit
            voluptatum necessitatibus adipisci facilis quae, quaerat sunt aut
            vitae veniam ullam! Ad! Delectus quos doloribus repudiandae sint
            error beatae perspiciatis mollitia modi quae et, dolorum corrupti
            molestias ipsam atque culpa cum eius aut excepturi cumque distinctio
            ad sed quasi. Beatae, soluta repellat? Laudantium facere
            consequuntur sed error pariatur velit delectus cupiditate veniam nam
            quae nostrum, architecto dolor, nisi ullam animi provident
            blanditiis accusamus, temporibus quo eveniet itaque. Modi cupiditate
            mollitia culpa iure. Nihil quis eius magni, totam repellendus rerum.
            Quisquam, vero voluptatem fugit facere repudiandae itaque beatae ab
            excepturi amet ipsum molestias quo, alias ipsam? Sed, nobis. Neque
            velit expedita doloremque provident. Reiciendis iste excepturi odit
            quisquam amet, saepe ipsam totam error consequuntur ab aut
            recusandae possimus impedit tempora vel at assumenda, voluptatum
            maiores. Cum, quam. Aliquid excepturi ipsam eius itaque neque! Iure
            vitae deleniti, amet eveniet beatae quasi rerum perspiciatis ullam
            modi nemo mollitia veritatis nihil quisquam quis? Provident,
            voluptatibus vitae rem veniam eum illo necessitatibus commodi vel
            autem sequi nisi! Recusandae ipsa repudiandae deserunt vero cumque
            provident dolorum ducimus illo quidem, ea architecto? Dicta, minima,
            pariatur libero nisi tempora quia officia quaerat ullam nam nobis,
            inventore aliquam fuga error. Ducimus.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AiResponse;
