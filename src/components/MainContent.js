import React from 'react';
import HomePage from '../pages/Home';
import DevicesPage from '../pages/Devices';
import DeviceSocketPage from '../pages/DeviceSocketPage';
import CertPage from '../pages/Certs';
import CRLPage from '../pages/CRL';

const MainContent = ({ activeItem }) => {
  switch (activeItem) {
    case 'devices':
      return <DevicesPage />;
    case 'socket':
      return <DeviceSocketPage />;
    case 'cert':
      return <CertPage />;
    case 'CRL':
      return <CRLPage />;
    default:
      return <HomePage />;
  }
};

export default MainContent;