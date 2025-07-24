import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Statistics
  getStatistics: async () => {
    const response = await api.get('/statistics');
    return response.data;
  },
  
  // Agencies
  getAgencies: async () => {
    const response = await api.get('/agencies');
    return response.data;
  },
  createAgency: async (data) => {
    const response = await api.post('/agencies', data);
    return response.data;
  },
  updateAgency: async (id, data) => {
    const response = await api.put(`/agencies/${id}`, data);
    return response.data;
  },
  deleteAgency: async (id) => {
    const response = await api.delete(`/agencies/${id}`);
    return response.data;
  },
  
  // Agents
  getAgents: async () => {
    const response = await api.get('/agents');
    return response.data;
  },
  createAgent: async (data) => {
    const response = await api.post('/agents', data);
    return response.data;
  },
  
  // Tickets
  getTicketQueue: async () => {
    const response = await api.get('/tickets/queue');
    return response.data;
  },
  callNextTicket: async () => {
    const response = await api.post('/tickets/call-next');
    return response.data;
  },
  
  // Travel time calculation
  calculateTravelTime: async (data) => {
    const response = await api.post('/calculate-travel-time', data);
    return response.data;
  },

  // User profile
  updateProfile: async (data) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },
  getUserProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
};
