import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/pages/_crl.css';

const CRLPage = () => {
  const [crlData, setCrlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCRL = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crl/abc');
        setCrlData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CRL:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCRL();
  }, []);

  if (loading) return <div className="loading">Loading CRL data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="crl-page">
      <div className="crl-header">
        <h2>Certificate Revocation List (CRL) Management</h2>
        <div className="crl-meta">
          <div>Issuer: MyCA</div>
          <div>This Update: {new Date(crlData.thisUpdate).toLocaleString()}</div>
          <div>Next Update: {new Date(crlData.nextUpdate).toLocaleString()}</div>
          <div>CRL Version: {crlData.crlNumber}</div>
        </div>
      </div>

      <div className="crl-container">
        <div className="revoked-certs">
          <h3>Revoked Certificates</h3>
          {crlData.revokedCertificates.length === 0 ? (
            <div className="no-revoked">No revoked certificates found</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Device ID</th>
                  <th>Serial Number</th>
                  <th>Revocation Date</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {crlData.revokedCertificates.map((cert, index) => (
                  <tr key={index}>
                    <td>{cert.deviceId}</td>
                    <td className="serial">{cert.serialNumber}</td>
                    <td>{new Date(cert.revocationDate).toLocaleString()}</td>
                    <td>
                      <span className={`reason-badge ${cert.reason}`}>
                        {cert.reason}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="crl-pem">
          <h3>CRL (PEM Format)</h3>
          <pre>{crlData.crlPem}</pre>
          <button 
            onClick={() => navigator.clipboard.writeText(crlData.crlPem)}
            className="copy-btn"
          >
            Copy CRL to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CRLPage;