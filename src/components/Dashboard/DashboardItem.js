import React from 'react';
import '../../styles/components/_dashboard.css';

const DashboardItem = ({ icon, label, active, onClick }) => {
  return (
    <div 
      className={`dashboard-item ${active ? 'active' : ''}`} 
      onClick={onClick}
    >
      <span className="dashboard-icon">{icon}</span>
      <span className="dashboard-label">{label}</span>
    </div>
  );
};

export default DashboardItem;