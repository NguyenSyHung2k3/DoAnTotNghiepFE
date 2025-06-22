import { useEffect, useState } from 'react';
import socketService from '../services/socketService';

export default function useSocket(deviceId, shouldConnect) {
  const [isConnected, setIsConnected] = useState(false);
  const [encryptedData, setEncryptedData] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [decryptionStatus, setDecryptionStatus] = useState(null);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState([]);

  useEffect(() => {
    if (!shouldConnect || !deviceId) return;

    const socket = socketService.connect('http://localhost:5000');

    socket.on('connect', () => {
      setIsConnected(true);
      socketService.subscribe(deviceId);
      setError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Nhận dữ liệu chưa giải mã
    socket.on('encrypted_data', (data) => {
      setEncryptedData(prev => {
        const encryptedData = [...prev.slice(-10), {
          ...data,
          type: 'encrypted',
          timestamp: new Date().toISOString()
        }];
        console.log('[Socket] Updated encryptedData:', encryptedData);
        return encryptedData;
      });
    });

    // Nhận dữ liệu đã giải mã
    socket.on('sensor_data', (data) => {
      setSensorData(prev => [...prev.slice(-50), {
        ...data,
        type: 'decrypted',
        timestamp: new Date().toISOString()
      }]);
    });

    // Nhận trạng thái giải mã
    socket.on('decryption_status', (status) => {
      setDecryptionStatus(status);
      setTimeout(() => setDecryptionStatus(null), 3000); // Tự động ẩn sau 3s
    });

    socket.on('device_status', (data) => {
      setConnectionStatus(prev => [...prev.slice(-50), {
        ...data,
        timestamp: new Date().toISOString()
      }]);
    })

    socket.on('error', (err) => {
      setError(err);
      setIsConnected(false);
    });

    return () => {
      socketService.unsubscribe(deviceId);
      socketService.disconnect();
      setIsConnected(false);
    };
  }, [deviceId, shouldConnect]);

  // Reset data when disconnecting
  useEffect(() => {
    if (!shouldConnect) {
      setEncryptedData([]);
      setSensorData([]);
      setDecryptionStatus(null);
      setError(null);
      setConnectionStatus([]);
    }
  }, [shouldConnect]);

  return { 
    isConnected, 
    encryptedData, 
    sensorData, 
    decryptionStatus,
    error,
    connectionStatus
  };
}