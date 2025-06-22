import React, { useState } from 'react';
import '../../styles/components/_device-detail.css';

const DeviceDetail = ({ device }) => {
  const [expandedFields, setExpandedFields] = useState({});
  const [copied, setCopied] = useState(null);

  if (!device) {
    return <div className="device-detail">Select a device to view details</div>;
  }

  const toggleExpand = (field) => {
    setExpandedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopied(fieldName);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAllDeviceInfo = () => {
    const deviceInfo = `Device ID: ${device.device_id}
Serial: ${device.serial}
Status: ${device.status}
Registered At: ${new Date(device.registered_at).toLocaleString()}
Expiry: ${new Date(device.expiry).toLocaleString()}
Certificate: ${device.certificate}
Public Key X: ${device.public_key_x}
Public Key Y: ${device.public_key_y}
Shared Secret: ${device.shared_secret || 'N/A'}`;
    
    copyToClipboard(deviceInfo, 'all');
  };

  const renderFieldWithToggle = (field, label, value) => {
    const isExpanded = expandedFields[field];
    const displayValue = isExpanded ? value : `${value.substring(0, 30)}...`;
    const canExpand = value.length > 30;

    return (
      <div className={`detail-item ${field}-container ${isExpanded ? 'expanded' : ''}`}>
        <div className="field-header">
          <span className="detail-label">{label}:</span>
          <div className="field-actions">
            {canExpand && (
              <button 
                onClick={() => toggleExpand(field)}
                className="toggle-btn"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            )}
            <button
              onClick={() => copyToClipboard(value, field)}
              className="copy-btn"
              title="Copy to clipboard"
            >
              {copied === field ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <pre className={`detail-value ${field}-value`}>
          {displayValue}
        </pre>
      </div>
    );
  };

  return (
    <div className="device-detail">
      <div className="device-header">
        <h2>Device Details</h2>
        <button 
          onClick={copyAllDeviceInfo}
          className="copy-all-btn"
        >
          {copied === 'all' ? '✓ All Info Copied' : 'Copy All Info'}
        </button>
      </div>
      
      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Device ID:</span>
            <span className="detail-value">{device.device_id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Serial:</span>
            <span className="detail-value serial-value">{device.serial}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className={`detail-value status-badge ${device.status}`}>
              {device.status}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Registered At:</span>
            <span className="detail-value">
              {new Date(device.registered_at).toLocaleString()}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Expiry:</span>
            <span className="detail-value">
              {new Date(device.expiry).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="security-section">
        <h3>Security Information</h3>
        
        {renderFieldWithToggle('certificate', 'Certificate', device.certificate)}
        
        <div className="security-grid">
          {renderFieldWithToggle('public_key_x', 'Public Key X', device.public_key_x)}
          {renderFieldWithToggle('public_key_y', 'Public Key Y', device.public_key_y)}
          {device.shared_secret && (
            renderFieldWithToggle('shared_secret', 'Shared Secret', device.shared_secret)
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
