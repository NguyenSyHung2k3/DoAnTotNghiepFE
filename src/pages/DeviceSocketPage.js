import React, {useState, useRef, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import SocketPanel from '../components/Devices/DeviceSocket/SocketPanel';
import SocketGraph from '../components/Devices/DeviceSocket/SocketGraph';
import PerformanceMetrics from '../components/Devices/MeasureSocket/PerformanceMetrics';
import SocketStatus from '../components/Devices/DeviceSocket/SocketStatus';
import '../styles/pages/_device-socket.css';
import '../styles/components/_socket-panel.css';

const DeviceSocketPage = () => {
  const [deviceId, setDeviceId] = useState('fc:b4:67:4f:1d:e0');
  const [viewMode, setViewMode] = useState('table');
  const [expandedItems, setExpandedItems] = useState({});
  const [shouldConnect, setShouldConnect] = useState(false);

  const toggleExpand = (type, index) => {
    setExpandedItems(prev => ({
      ...prev,
      [`${type}-${index}`]: !prev[`${type}-${index}`]
    }));
  };

  const {
    isConnected,
    encryptedData,
    sensorData: decryptedData,
    decryptionStatus,
    error,
    connectionStatus
  } = useSocket(deviceId, shouldConnect);


  useEffect(() => {
    if (error) {
      console.error('Socket error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (decryptionStatus) {
      console.log('Decryption status:', decryptionStatus);
    }
  }, [decryptionStatus]);

  const handleConnect = () => {
    console.log('Connecting to device:', deviceId);
    if (deviceId.trim()) {
      setShouldConnect(true);
    }
  };

  const handleDisconnect = () => {
    setDeviceId(''); 
    setShouldConnect(false);
  };

  return (
    <div className="socket-fullpage">
      <div className="socket-header">
        <div className="header-content">
          <h2>Device Socket Monitor</h2>
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
              disabled={!deviceId.trim() || isConnected}
              className="connect-button"
            >
              {isConnected ? 'Connected' : 'Connect'}
            </button>
            <button
              onClick={handleDisconnect}
              disabled={!isConnected}
              className="disconnect-button"
            >
              Disconnect
            </button>
          </div>
        </div>
        
        <div className="connection-status">
          <span>Status: </span>
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      

      <div className="view-toggle-bar">
        <button
          className={viewMode === 'table' ? 'view-toggle active' : 'view-toggle'}
          onClick={() => setViewMode('table')}
        >
          Xem Dữ Liệu
        </button>
        <button
          className={viewMode === 'chart' ? 'view-toggle active' : 'view-toggle'}
          onClick={() => setViewMode('chart')}
        >
          Xem Biểu Đồ
        </button>
         <button
            className={viewMode === 'performance' ? 'view-toggle active' : 'view-toggle'}
            onClick={() => setViewMode('performance')}
          >
            Hiệu Suất & Năng Lượng
          </button>
      </div>

      {/* <div className="status-log">
          <h3>Nhật ký quá trình kết nối</h3>
          <div className="status-messages">
            {connectionStatus.length > 0 ? (
              connectionStatus.map((data, index) => (
                <div key={index} className={`status-message ${data.status}`}>
                  <span className="timestamp">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="message">{data.message}</span>
                  {data.details && (
                    <pre className="details">
                      {JSON.stringify(data.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            ) : (
              <p>Chưa có dữ liệu trạng thái</p>
            )}
          </div>
      </div> */}

      <div className="socket-content">
        {viewMode === 'table' ? (
          <div className="socket-data-grid">
            {/* Encrypted Data Column */}
            <div className="data-column encrypted-column">
              <div className="column-header">
                <h3>Encrypted Data <span className="data-count">{encryptedData.length}</span></h3>
              </div>
              <div className="data-items-container">
                {encryptedData.length > 0 ? (
                  encryptedData.map((data, index) => (
                    <div key={`encrypted-${index}`} className="data-item encrypted">
                      <div className="data-header" onClick={() => toggleExpand('encrypted', index)}>
                        <div className="data-timestamp">
                          {new Date(data.timestamp).toLocaleString()}
                        </div>
                        <button className="expand-button">
                          {expandedItems[`encrypted-${index}`] ? '▲' : '▼'}
                        </button>
                      </div>
                      {expandedItems[`encrypted-${index}`] && (
                        <div className="encrypted-data-details">
                          <div className="data-field">
                            <span className="field-label">Device ID:</span>
                            <span className="field-value" title={data.device_id}>
                              {data.device_id || 'N/A'}
                            </span>
                          </div>
                          <div className="data-field">
                            <span className="field-label">Ciphertext:</span>
                            <span 
                              className="field-value truncated" 
                              title={data.ciphertext}
                            >
                              {data.ciphertext ? `${data.ciphertext.substring(0, 20)}...` : 'N/A'}
                            </span>
                          </div>
                          <div className="data-field">
                            <span className="field-label">Tag:</span>
                            <span 
                              className="field-value truncated" 
                              title={data.tag}
                            >
                              {data.tag ? `${data.tag.substring(0, 10)}...` : 'N/A'}
                            </span>
                          </div>
                          <div className="data-field">
                            <span className="field-label">IV/Nonce:</span>
                            <span 
                              className="field-value truncated" 
                              title={data.iv}
                            >
                              {data.iv ? `${data.iv.substring(0, 10)}...` : 'N/A'}
                            </span>
                          </div>
                          <div className="data-field">
                            <span className="field-label">Encryption Type:</span>
                            <span className="field-value">
                              {data.encryption_type || 'N/A'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="data-item">
                    <p>No encrypted data received yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Decrypted Data Column */}
            <div className="data-column decrypted-column">
              <div className="column-header">
                <h3>Decrypted Data <span className="data-count">{decryptedData.length}</span></h3>
              </div>
              <div className="data-items-container">
                {decryptedData.length > 0 ? (
                  decryptedData.map((data, index) => (
                    <div key={`decrypted-${index}`} className="data-item decrypted">
                      <div className="data-header" onClick={() => toggleExpand('decrypted', index)}>
                        <div className="data-timestamp">
                          {new Date(data.timestamp).toLocaleString()}
                        </div>
                        <button className="expand-button">
                          {expandedItems[`decrypted-${index}`] ? '▲' : '▼'}
                        </button>
                      </div>
                      {expandedItems[`decrypted-${index}`] && (
                        <div className="json-viewer">
                          <pre>{JSON.stringify({
                            temperature: data.temperature,
                            humidity: data.humidity,
                            wifi_rssi: data.wifi_rssi,
                            encryption_time_us: data.encryption_time_us,
                            encryption_energy_uj: data.encryption_energy_uj,
                            plaintext_size_bytes: data.plaintext_size_bytes,
                            ciphertext_size_bytes: data.ciphertext_size_bytes,
                            encryption_type: data.encryption_type || 'present-cbc',
                            nonce: data.nonce,
                            tag: data.tag,
                            cycles_per_byte: data.cycles_per_byte,
                            total_cycles: data.total_cycles,
                            timestamp: data.timestamp
                          }, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="data-item">
                    <p>Waiting for decrypted data...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : viewMode === 'chart' ? (
          <div className="socket-graph-container">
            <h3>Biểu đồ dữ liệu</h3>
            <SocketGraph data={decryptedData} />
          </div>
        ) : (
        <div className="socket-performance-container">
          <PerformanceMetrics data={encryptedData} />
        </div>
      )}
      </div>
    </div>
  );
};

export default DeviceSocketPage;