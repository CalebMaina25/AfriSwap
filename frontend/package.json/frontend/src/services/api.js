import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Auth API
 */
export const authApi = {
  signup: (email, password, displayName) =>
    apiClient.post('/api/auth/signup', { email, password, displayName }),

  login: (email, password) =>
    apiClient.post('/api/auth/login', { email, password }),

  logout: () =>
    apiClient.post('/api/auth/logout'),

  me: () =>
    apiClient.get('/api/auth/me')
};

/**
 * Trade API
 */
export const tradeApi = {
  list: (filters = {}) =>
    apiClient.get('/api/trades', { params: filters }),

  create: (trade) =>
    apiClient.post('/api/trades', trade),

  get: (id) =>
    apiClient.get(`/api/trades/${id}`),

  update: (id, updates) =>
    apiClient.put(`/api/trades/${id}`, updates)
};

/**
 * Wallet API
 */
export const walletApi = {
  getBalance: (userId) =>
    apiClient.get(`/api/wallet/${userId}`),

  deposit: (userId, currency, amount) =>
    apiClient.post(`/api/wallet/${userId}/deposit`, { currency, amount }),

  withdraw: (userId, currency, amount) =>
    apiClient.post(`/api/wallet/${userId}/withdraw`, { currency, amount }),

  getTransactions: (userId) =>
    apiClient.get(`/api/wallet/${userId}/transactions`)
};

/**
 * Health API
 */
export const healthApi = {
  check: () =>
    apiClient.get('/health')
};

export default apiClient;
