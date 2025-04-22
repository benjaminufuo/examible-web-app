import React from "react";
import "../../styles/errorpage.css";
import { useNavigate } from "react-router";
const ErrorPgae = () => {
  const navigate = useNavigate();
  return (
    <main className="errorpagemain">
      <section className="erorrnumber">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="166"
          viewBox="0 0 332 198"
          fill="none"
        >
          <path
            d="M0.79248 45.2518L32.6779 7.56896H148.625L116.74 45.2518H184.859V0.322266L276.167 7.56896V45.2518H331.242V129.313H276.167V197.432H184.859V129.313H0.79248V45.2518Z"
            fill="#804BF2"
            stroke="black"
            stroke-width="0.362335"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="281"
          height="194"
          viewBox="0 0 313 226"
          fill="none"
        >
          <path
            d="M97.1023 43.9802H2.89525C-4.22609 111.154 1.37518 144.968 52.1728 188.914C96.5404 221.982 123.314 228.899 173.917 223.698C223.63 214.946 251.457 203.407 284.067 166.449C318.126 106.302 315.711 65.7694 307.256 0.5L218.847 23.6894C218.847 23.6894 217.398 83.837 211.6 110.65C205.803 137.463 136.959 147.608 113.045 130.941C89.131 114.273 97.1023 43.9802 97.1023 43.9802Z"
            fill="#804BF2"
            stroke="black"
            stroke-width="0.362335"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="172"
          viewBox="0 0 332 208"
          fill="none"
        >
          <path
            d="M0.767578 55.3244L41.3491 0.249512L148.6 17.6416L116.715 55.3244H184.834V10.3949L276.142 17.6416V55.3244H331.217V139.386H276.142V207.505H184.834V139.386H0.767578V55.3244Z"
            fill="#804BF2"
            stroke="black"
            stroke-width="0.362335"
          />
        </svg>
      </section>
      <div className="errortext">
        <span className="errormaintext">
          <em className="errorem">Error 404:</em> Page Not Found
        </span>
        <p className="errorparagraph">
          This page doesn’t exist, or it has been moved. Let’s get you back on
          track with your JAMB prep.
        </p>
        <button className="backtohome" onClick={() => navigate("/")}>
          Go to homepage
        </button>
      </div>
    </main>
  );
};

export default ErrorPgae;
