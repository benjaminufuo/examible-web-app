import React from "react";
import "../styles/footer.css";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import FooterLogo from "../assets/public/legacy_builder_logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="footer-topHolder">
          <div className="footer-iconHolder">
            <img src={FooterLogo} alt="LEGACY BUILDERS" />
          </div>
          <div className="footer-aboutUs">
            <h3>About Us</h3>
            <ul>
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  cursor: "pointer",
                }}
                to={"/"}
              >
                Mock Exam
              </Link>
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  cursor: "pointer",
                }}
                to={"/"}
              >
                Past Question
              </Link>
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  cursor: "pointer",
                }}
                to={"/login"}
              >
                Get Started
              </Link>
            </ul>
          </div>
          <div className="footer-contactUs">
            <h3>Contact us</h3>
            <p>
              163, Muyibi Street,
              <br />
              Olodi-Apapa, Lagos
            </p>
            <h5>
              +234 818 6793482 <br />
              +234 816 5883204
            </h5>
          </div>
          <div className="footer-handles">
            <h3>Get in touch</h3>
            <article>
              <MdEmail
                fontSize={24}
                cursor={"pointer"}
                onClick={() =>
                  (window.location.href = "mailto:legacybuilders710@gmail.com")
                }
              />
              legacybuilders710@gmail.com
            </article>
            <main>
              <h6>Social Media</h6>
              <nav>
                <div>
                  <FaFacebook
                    fontSize={24}
                    cursor={"pointer"}
                    onClick={() =>
                      (window.location.href =
                        "https://www.facebook.com/profile.php?id=61575196836508&mibextid=LQQJ4d&mibextid=LQQJ4d")
                    }
                  />
                  <AiFillTwitterCircle fontSize={24} cursor={"pointer"} />
                  <FaLinkedin fontSize={24} cursor={"pointer"} />
                  <FaInstagram fontSize={24} cursor={"pointer"} />
                </div>
                <h6>@legacybuilders</h6>
              </nav>
            </main>
          </div>
        </div>
      </div>
      <footer className="footer-bottom">
        © 2025 Legacy Builders | All rights reserved
      </footer>
    </div>
  );
};

export default Footer;
