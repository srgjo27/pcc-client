import axios from 'axios';

// Create a centralized Axios Client instance
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.pcc-client.local/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For HTTP-only cookies
});

// Request interceptor to attach bearer tokens if saved in localStorage (as fallback)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors (like 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Clear tokens/session and optionally redirect
        localStorage.removeItem('auth_token');
      }
    }
    return Promise.reject(error);
  }
);
