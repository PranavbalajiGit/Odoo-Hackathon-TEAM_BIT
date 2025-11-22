import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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
let redirecting = false; // Flag to prevent multiple redirects

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (backend not running)
    if (!error.response) {
      console.error('Network error - backend may not be running:', error.message);
      // Don't redirect on network errors, just reject
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      // Only redirect if we're not already on the login page and haven't redirected recently
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/signup') && !redirecting) {
        redirecting = true;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Use a small delay to prevent immediate redirect loops
        setTimeout(() => {
          window.location.href = '/login';
          redirecting = false;
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Warehouse APIs
export const warehouseAPI = {
  getAll: (params) => api.get('/warehouses', { params }),
  getById: (id) => api.get(`/warehouses/${id}`),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.patch(`/warehouses/${id}`, data),
  delete: (id) => api.delete(`/warehouses/${id}`),
  getLocations: (warehouseId, params) => api.get(`/warehouses/${warehouseId}/locations`, { params }),
  createLocation: (warehouseId, data) => api.post(`/warehouses/${warehouseId}/locations`, data),
  updateLocation: (id, data) => api.patch(`/locations/${id}`, data),
  deleteLocation: (id) => api.delete(`/locations/${id}`),
};

// Operation APIs
export const operationAPI = {
  getAll: (params) => api.get('/operations', { params }),
  getById: (id) => api.get(`/operations/${id}`),
  create: (data) => api.post('/operations', data),
  update: (id, data) => api.patch(`/operations/${id}`, data),
  confirm: (id) => api.post(`/operations/${id}/confirm`),
  validate: (id) => api.post(`/operations/${id}/validate`),
  cancel: (id) => api.post(`/operations/${id}/cancel`),
};

// Stock APIs
export const stockAPI = {
  getStock: (params) => api.get('/stock', { params }),
  adjustStock: (data) => api.patch('/stock/adjust', data),
};

// Move APIs
export const moveAPI = {
  getMoves: (params) => api.get('/moves', { params }),
};

export default api;


