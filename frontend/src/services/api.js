import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network Error: Backend server tidak dapat dijangkau. Pastikan server berjalan di', API_URL);
      error.message = 'Server tidak dapat dijangkau. Pastikan backend server berjalan.';
    }
    
    return Promise.reject(error);
  }
);

export default api;

