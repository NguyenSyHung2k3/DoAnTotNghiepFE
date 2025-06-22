import React, {useState} from 'react';
import SocketStatus from './SocketStatus';
import '../../../styles/components/_socket-panel.css'

const SocketPanel = ({ onConnect }) => {
  const [deviceId, setDeviceId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    if (deviceId.trim()) {
      setIsConnecting(true);
      onConnect(deviceId.trim());
    }
  };

  return (
    <div className="socket-panel">
      <h3>Socket Connection</h3>
      <div className="connection-controls">
        <input
          type="text"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          placeholder="Enter Device ID"
          className="device-id-input"
        />
        <button 
          onClick={handleConnect}
          disabled={!deviceId.trim() || isConnecting}
          className="connect-button"
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

export default SocketPanel;