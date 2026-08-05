import axios from "axios";

// Dynamically determine API base URL based on current location
const getApiBaseUrl = () => {
  // Get the API URL from environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // If running on localhost or 127.0.0.1, try common backend ports
  const hostname = window.location.hostname;
  const port = window.location.port;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://${hostname}:5008`;
  }

  // If running on a network IP, use the same IP with backend port 5008.
  return `http://${hostname}:5008`;
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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
