import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/components/_device-list.css';

const DeviceList = ({ onDeviceSelect, refreshTrigger  }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/devices/all/devices');
        
        // Kiểm tra cấu trúc response và lấy mảng devices
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setDevices(response.data.data);
        } else {
          throw new Error('Invalid data format from API');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError(err.message);
        setLoading(false);
        setDevices([]);
      }
    };

    fetchDevices();
  }, [refreshTrigger]);

  if (loading) return <div className="loading">Loading devices...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="device-list">
      <h2>Devices</h2>
      {devices.length === 0 ? (
        <div className="no-devices">No devices found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Serial</th>
              <th>Status</th>
              <th>Registered At</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr 
                key={device._id} 
                onClick={() => onDeviceSelect(device)}
                className="device-row"
              >
                <td>{device.device_id}</td>
                <td className="serial-cell">{device.serial}</td>
                <td>
                  <span className={`status-badge ${device.status}`}>
                    {device.status}
                  </span>
                </td>
                <td>{new Date(device.registered_at).toLocaleString()}</td>
                <td>{new Date(device.expiry).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeviceList;