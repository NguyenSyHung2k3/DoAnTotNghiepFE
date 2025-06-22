import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Interceptor để xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Xử lý lỗi từ server
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Lỗi khi thiết lập request
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;