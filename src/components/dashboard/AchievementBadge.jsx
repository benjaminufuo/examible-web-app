import React from "react";
import "../../styles/dashboardCss/dashboard-components.css";

const AchievementBadge = ({
  icon: Icon,
  title,
  description,
  isUnlocked = false,
  className = "",
}) => {
  const statusClass = isUnlocked
    ? "achievement-badge--unlocked"
    : "achievement-badge--locked";

  return (
    <div className={`achievement-badge ${statusClass} ${className} fade-in`}>
      <div className="achievement-icon">
        {typeof Icon === "string" ? Icon : <Icon />}
      </div>
      <div className="achievement-content">
        <div className="achievement-title">{title}</div>
        <div className="achievement-desc">{description}</div>
      </div>
    </div>
  );
};

export default AchievementBadge;
