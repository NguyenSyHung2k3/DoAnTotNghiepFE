import React, { useState } from 'react';
import DeviceList from '../components/Devices/DeviceList';
import DeviceDetail from '../components/Devices/DeviceDetail';
import DeviceRegistrationModal from '../components/Devices/DeviceRegistrationModal';
import '../styles/pages/_devices.css'

const DevicesPage = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleRegistrationSuccess = (newDevice) => {
    setRegistrationSuccess(newDevice);
    setShowRegistrationModal(false);
    setSelectedDevice(newDevice); // Auto-select the newly registered device
    setRefreshTrigger(prev => !prev);
  };

  return (
    <div className="devices-page">
      <div className="devices-header">
        <div className="header-content">
          <h2>Device Management</h2>
          <button 
            onClick={() => setShowRegistrationModal(true)}
            className="register-device-btn"
          >
            + Register New Device
          </button>
        </div>
      </div>
      <div className="devices-container">
        <DeviceList onDeviceSelect={setSelectedDevice} refreshTrigger={refreshTrigger} />
        <DeviceDetail device={selectedDevice} />
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <DeviceRegistrationModal
          onClose={() => setShowRegistrationModal(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}

    </div>
  );
};

export default DevicesPage;