import React, { useState } from "react";
import "../styles/header.css";
import menuBar from "../assets/navBar.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderLogo from "../assets/public/legacy_builder_logo.png";
import hambuger from "../assets/public/hambuger.svg";

const Header = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <div className="header">
        <div className="header-holder">
          <div className="header-holderImg">
            <img
              src={HeaderLogo}
              alt="Legacy Builders"
              onClick={() => nav("/")}
            />
          </div>
          <div className="header-holderText">
            <ul>
              {menuBar.map((item, index) => (
                <li
                  key={index}
                  style={{
                    borderColor:
                      location.pathname === item.link ? "#804BF2" : "white",
                  }}
                >
                  <Link
                    to={item.link}
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <aside>
              <button className="header-signup" onClick={() => nav("/signup")}>
                SIGN UP
              </button>
              <button className="header-login" onClick={() => nav("/login")}>
                LOGIN
              </button>
            </aside>
          </div>
          <div
            className="header-menuIcon"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img src={hambuger} />
          </div>
        </div>
      </div>
      {showDropdown && (
        <div className="header-dropDown" onClick={()=>setShowDropdown(!showDropdown)}>
          <div className="header-dropDownHolder" onClick={(e)=>e.stopPropagation()}>
          <div className="headerDropdown-holderImg">
            <img
              src={HeaderLogo}
              alt="Legacy Builders"
              onClick={() => {
                nav("/"), setShowDropdown(!showDropdown);
              }}
            />
          </div>
          <div className="headerDropdown-holderText">
            <>
              {menuBar.map((item, index) => (
                <li
                  key={index}
                  style={{
                    borderColor:
                      location.pathname === item.link ? "#804BF2" : "white",
                  }}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <Link
                    to={item.link}
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </>
            <button
              className="headerDropdown-signup"
              onClick={() => nav("/signup")}
            >
              SIGN UP
            </button>
            <button
              className="headerDropdown-login"
              onClick={() => nav("/login")}
            >
              LOGIN
            </button>
          </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
