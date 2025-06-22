import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/pages/_cert.css';

const CertificatePage = () => {
  const { deviceId: initialDeviceId } = useParams();
  const [deviceId, setDeviceId] = useState(initialDeviceId || '');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [showSecret, setShowSecret] = useState(false);

  const fetchCertificate = async () => {
    if (!deviceId.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/${deviceId}`);
      const certData = response.data.data || response.data;
      
      setCertificate({
        device_id: certData.device_id,
        serial_number: certData.serial_number,
        certificate: certData.certificate,
        public_key_x: certData.public_key_x,
        public_key_y: certData.public_key_y,
        shared_secret: certData.shared_secret,
        expiry: certData.expiry,
        status: certData.status || 'active',
        registered_at: certData.registered_at
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch certificate');
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCertificate();
  };

  const handleRenew = async () => {
    setLoading(true);
    setActionStatus(null);
    try {
      await api.post(`/renew/${deviceId}`);
      setActionStatus({
        type: 'success',
        message: 'Certificate renewed successfully'
      });
      fetchCertificate(); // Refresh data
    } catch (err) {
      setActionStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to renew certificate'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
    
    setLoading(true);
    setActionStatus(null);
    try {
      await api.post(`/revoke/${deviceId}`, {
        serial: certificate?.serial_number
      });
      setActionStatus({
        type: 'success',
        message: 'Certificate revoked successfully'
      });
      fetchCertificate(); // Refresh data
    } catch (err) {
      setActionStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to revoke certificate'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowSecret = () => {
    setShowSecret(!showSecret);
  };

  useEffect(() => {
    if (initialDeviceId) {
      fetchCertificate();
    }
  }, [initialDeviceId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="certificate-page">
      <div className="certificate-header">
        <h2>Certificate Management</h2>
      </div>

      <div className="certificate-container">
        <div className="search-panel">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Enter Device ID"
              className="device-id-input"
              required
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {loading && !certificate ? (
          <div className="status-message loading">Loading certificate data...</div>
        ) : error ? (
          <div className="status-message error">{error}</div>
        ) : certificate ? (
          <div className="certificate-details">
            <div className="detail-section">
              <h3>Certificate Information for {certificate.device_id}</h3>
              <div className="detail-grid">
                <div className="detail-row">
                  <span className="detail-label">Serial Number:</span>
                  <span className="detail-value">{certificate.serial_number || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value status-${certificate.status}`}>
                    {certificate.status.toUpperCase()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Registered At:</span>
                  <span className="detail-value">{formatDate(certificate.registered_at)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Expiry Date:</span>
                  <span className="detail-value">{formatDate(certificate.expiry)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Public Key (X):</span>
                  <span className="detail-value fingerprint">
                    {certificate.public_key_x || 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Public Key (Y):</span>
                  <span className="detail-value fingerprint">
                    {certificate.public_key_y || 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Shared Secret:</span>
                  <div className="secret-value">
                    {showSecret ? (
                      <span className="fingerprint">{certificate.shared_secret || 'N/A'}</span>
                    ) : (
                      <span className="hidden-secret">••••••••••••••••</span>
                    )}
                    <button 
                      type="button" 
                      onClick={toggleShowSecret}
                      className="toggle-secret-button"
                    >
                      {showSecret ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="detail-row full-width">
                  <span className="detail-label">Certificate:</span>
                  <span className="detail-value certificate-value">
                    {certificate.certificate || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="action-section">
              <div className="action-buttons">
                <button
                  onClick={handleRenew}
                  disabled={loading || certificate.status === 'revoked'}
                  className="action-button renew-button"
                >
                  Renew Certificate
                </button>
                <button
                  onClick={handleRevoke}
                  disabled={loading || certificate.status === 'revoked'}
                  className="action-button revoke-button"
                >
                  Revoke Certificate
                </button>
              </div>

              {actionStatus && (
                <div className={`action-status ${actionStatus.type}`}>
                  {actionStatus.message}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="status-message info">
            {deviceId ? 'No certificate found for this device' : 'Enter a Device ID to search'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatePage;