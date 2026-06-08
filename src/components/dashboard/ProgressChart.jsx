import React from "react";
import "../../styles/dashboardCss/dashboard-components.css";

const ProgressChart = ({ title, children, className = "" }) => {
  return (
    <div className={`progress-chart ${className} fade-in`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart-container">{children}</div>
    </div>
  );
};

export default ProgressChart;
