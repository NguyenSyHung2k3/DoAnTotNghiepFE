import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Devices from './pages/Devices';
import DeviceSocketPage from './pages/DeviceSocketPage'; // Thêm mới
import Dashboard from './components/Dashboard/Dashboard';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [activeItem, setActiveItem] = useState('home');

  // Lấy location để xác định route hiện tại
  const location = window.location;
  const isDevicesPage = location.pathname === '/devices';

  return (
    <Router>
      {isDevicesPage ? (
        <Devices />
      ) : (
        <div className="app">
          <Dashboard activeItem={activeItem} onItemClick={setActiveItem} />
          <MainContent activeItem={activeItem} />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/devices/:deviceId/socket" element={<DeviceSocketPage />} />
      </Routes>
    </Router>
  );
}

export default App;