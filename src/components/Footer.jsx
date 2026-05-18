import "../styles/footer.css";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import FooterLogo from "../assets/public/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="footer-topHolder">
          <div className="footer-iconHolder">
            <img src={FooterLogo} alt="Examible" />
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
                to={"/mock-exam"}
              >
                Mock Exam
              </Link>
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  cursor: "pointer",
                }}
                to={"/past-questions"}
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
            <p>Flat 4, 6 Yusuf Olorinde Street Olodi Apapa Lagos</p>
            <h5>
              +234 913 1701630 <br />
              +234 815 8882242
            </h5>
          </div>
          <div className="footer-handles">
            <h3>Get in touch</h3>
            <article
              style={{ cursor: "pointer" }}
              onClick={() =>
                (window.location.href = "mailto:info@examible.com")
              }
            >
              <MdEmail fontSize={24} />
              info@examible.com
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
                        "https://web.facebook.com/Examible?mibextid=wwXIfr&rdid=isjFTYNmRlIOBirr&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1GsqJnCB1A%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr")
                    }
                  />
                  <FaLinkedin
                    fontSize={24}
                    cursor={"pointer"}
                    onClick={() =>
                      (window.location.href =
                        "https://www.linkedin.com/company/examible")
                    }
                  />
                  <FaInstagram
                    fontSize={24}
                    cursor={"pointer"}
                    onClick={() =>
                      (window.location.href =
                        "https://www.instagram.com/examible?igsh=MWswazkxcmVnaWoybQ%3D%3D&utm_source=qr")
                    }
                  />
                </div>
                <h6>@examible</h6>
              </nav>
            </main>
          </div>
        </div>
      </div>
      <footer className="footer-bottom">
        © {new Date().getFullYear()} Examible | All rights reserved
      </footer>
    </div>
  );
};

export default Footer;
