import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const notificationAPI = {
  // Send notification to specific tokens
  sendToTokens: async (data) => {
    const response = await api.post('/notifications/send', data);
    return response.data;
  },

  // Send notification to topic
  sendToTopic: async (data) => {
    const response = await api.post('/notifications/send-to-topic', data);
    return response.data;
  },

  // Subscribe tokens to topic
  subscribeToTopic: async (data) => {
    const response = await api.post('/topics/subscribe', data);
    return response.data;
  },

  // Unsubscribe tokens from topic
  unsubscribeFromTopic: async (data) => {
    const response = await api.post('/topics/unsubscribe', data);
    return response.data;
  },
};

export const healthAPI = {
  // Check server health
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 