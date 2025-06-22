import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(url) {
    this.socket = io(url, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    return this.socket;
  }

  subscribe(deviceId) {
    if (this.socket) {
      this.socket.emit('subscribe_device', deviceId);
    }
  }

  unsubscribe(deviceId) {
    if (this.socket) {
      this.socket.emit('unsubscribe_device', deviceId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
}

const socketService = new SocketService();
export default socketService;