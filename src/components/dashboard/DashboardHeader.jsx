import React from "react";
import "../../styles/dashboardCss/dashboard-components.css";

const DashboardHeader = ({
  title,
  subtitle,
  image,
  stats = [],
  greeting = true,
  userName = "Student",
}) => {
  return (
    <section className="dashboard-hero-section slide-in">
      <div className="hero-content">
        {greeting && (
          <>
            <h1 className="hero-greeting">
              Welcome, <span>{userName}</span>
            </h1>
            <p className="hero-subtext">{subtitle}</p>
          </>
        )}
        {!greeting && title && (
          <>
            <h1 className="hero-greeting">{title}</h1>
            {subtitle && <p className="hero-subtext">{subtitle}</p>}
          </>
        )}

        {stats.length > 0 && (
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="hero-stat-item">
                <div className="stat-number">{stat.value}</div>
                <div className="stat-desc">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {image && (
        <div className="hero-image">
          <img src={image} alt={title || "Dashboard"} />
        </div>
      )}
    </section>
  );
};

export default DashboardHeader;
