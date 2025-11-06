/**
 * API client for REST endpoints
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Chat completion (non-streaming)
 */
export const chatCompletion = async (message, userId, sessionId, model = null) => {
  const response = await api.post('/chat/', {
    message,
    user_id: userId,
    session_id: sessionId,
    model: model,
  });
  return response.data;
};

/**
 * Get conversation history
 */
export const getHistory = async (userId, sessionId, limit = 50) => {
  const response = await api.post('/history/get', {
    user_id: userId,
    session_id: sessionId,
    limit,
  });
  return response.data;
};

/**
 * Save conversation history
 */
export const saveHistory = async (userId, sessionId, userMessage, assistantMessage) => {
  const response = await api.post('/history/save', {
    user_id: userId,
    session_id: sessionId,
    user_message: userMessage,
    assistant_message: assistantMessage,
  });
  return response.data;
};

/**
 * Get user sessions
 */
export const getUserSessions = async (userId, limit = 50) => {
  const response = await api.get(`/history/sessions/${userId}`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Delete session
 */
export const deleteSession = async (userId, sessionId) => {
  const response = await api.delete(`/history/session/${userId}/${sessionId}`);
  return response.data;
};

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

/**
 * Get available chatbot providers
 */
export const getProviders = async () => {
  const response = await api.get('/api/providers');
  return response.data;
};

/**
 * Get specific provider info
 */
export const getProviderInfo = async (providerId) => {
  const response = await api.get(`/api/providers/${providerId}`);
  return response.data;
};

export default api;
