import React from "react";
import "../../styles/dashboardCss/dashboard-components.css";

const StatCard = ({
  icon: Icon,
  label,
  value,
  footer,
  variant = "default",
  className = "",
}) => {
  const variantClass = {
    default: "",
    accent: "stat-card--accent",
    gold: "stat-card--gold",
  }[variant];

  return (
    <div className={`stat-card ${variantClass} ${className} fade-in`}>
      <div className="stat-header">
        <div className="stat-icon">
          {typeof Icon === "string" ? Icon : <Icon />}
        </div>
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <div className="stat-value">{value}</div>
      </div>
      {footer && <div className="stat-footer">{footer}</div>}
    </div>
  );
};

export default StatCard;
