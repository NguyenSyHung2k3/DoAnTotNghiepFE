import React from 'react';
import PropTypes from 'prop-types';

const SocketStatus = ({ connected }) => {
  return (
    <div className="socket-status">
      <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}>
        {connected ? '🟢' : '🔴'}
      </span>
      <span className="status-text">
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

SocketStatus.propTypes = {
  connected: PropTypes.bool.isRequired
};

export default SocketStatus;