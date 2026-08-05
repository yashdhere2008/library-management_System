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
    // Try the backend port (5008, 5007, 5005, etc.)
    return `http://${hostname}:5008`;
  }

  // If running on a network IP, use the same IP with backend port
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

export default API;
