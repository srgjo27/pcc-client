import axios from 'axios';

import { ENDPOINTS } from '@/constants/endpoints';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL!,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    const isPublicEndpoint =
      config.url === ENDPOINTS.AUTH.LOGIN ||
      config.url === ENDPOINTS.AUTH.REGISTER;

    if (token && config.headers && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('access_token');
      }
    }
    return Promise.reject(error);
  }
);
