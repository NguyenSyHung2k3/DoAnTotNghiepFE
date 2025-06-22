import React from 'react';
import DashboardItem from './DashboardItem';
import '../../styles/components/_dashboard.css';

const Dashboard = ({ onItemClick, activeItem }) => {
  const items = [
    { id: 'devices', label: 'Devices' },
    { id: 'socket', label: 'Socket Monitor' }, 
    { id: 'cert', label: 'Cert Config'},
    { id: 'CRL', label: 'CRL'},
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Menu</h2>
      </div>
      <div className="dashboard-items">
        {items.map((item) => (
          <DashboardItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.id}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;