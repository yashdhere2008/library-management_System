import axios from "axios";

// Dynamically determine API base URL based on current location
const getApiBaseUrl = () => {
  // Get the API URL from environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const hostname = window.location.hostname || 'localhost';

  // The backend defaults to port 5008 but falls back to 5009/5010 if in use.
  // Try the configured/env port first, then fall back to common ports.
  const configuredPort = import.meta.env.VITE_API_PORT;

  if (configuredPort) {
    return `http://${hostname}:${configuredPort}`;
  }

  return `http://${hostname}:5009`;
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle network errors gracefully
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error' && !error.response) {
      console.error('Backend server not accessible at:', getApiBaseUrl());
    }
    return Promise.reject(error);
  }
);

// Debugging: log requests and responses when VITE_DEBUG_API is set
if (import.meta.env.VITE_DEBUG_API === 'true') {
  API.interceptors.request.use((config) => {
    console.debug('[API REQUEST]', config.method?.toUpperCase(), config.url, config.data || config.params || '');
    return config;
  });

  API.interceptors.response.use(
    (res) => {
      console.debug('[API RESPONSE]', res.status, res.config.url, res.data);
      return res;
    },
    (err) => {
      console.debug('[API ERROR]', err.response?.status, err.response?.config?.url, err.response?.data || err.message);
      return Promise.reject(err);
    }
  );
}

export default API;
