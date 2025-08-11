import axios from 'axios';
import { API_CONFIG, API_ERROR_MESSAGES, HTTP_STATUS } from '../config/apiConfig';

const api = axios.create({
  baseURL: API_CONFIG.API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    if (API_CONFIG.ENABLE_LOGGING) {
      console.log("API Request to:", config.url);
      console.log("Request method:", config.method);
      console.log("Request data:", config.data);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (API_CONFIG.ENABLE_LOGGING) {
        console.log("Token added to request");
      }
    } else {
      if (API_CONFIG.ENABLE_LOGGING) {
        console.log("No token found, proceeding without authentication");
      }
    }
    
    return config;
  },
  error => {
    if (API_CONFIG.ENABLE_LOGGING) {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  response => {
    if (API_CONFIG.ENABLE_LOGGING) {
      console.log("API Response from:", response.config.url);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
    }
    return response;
  },
  error => {
    if (API_CONFIG.ENABLE_LOGGING) {
      console.error("API Error Response:");
      console.error("URL:", error.config?.url);
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Error Data:", error.response?.data);
      console.error("Error Message:", error.message);
    }
    
    // Handle authentication errors
    if (
      error.response &&
      (error.response.status === HTTP_STATUS.UNAUTHORIZED || 
       error.response.status === HTTP_STATUS.FORBIDDEN)
    ) {
      if (API_CONFIG.ENABLE_LOGGING) {
        console.log("Authentication error, redirecting to login");
      }
      
      // Clear stored data and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = API_ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      error.message = API_ERROR_MESSAGES.TIMEOUT_ERROR;
    }
    
    return Promise.reject(error);
  },
);

export default api;
