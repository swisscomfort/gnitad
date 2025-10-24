import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout user
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: {
    pseudonym: string;
    email: string;
    password: string;
    ageRange: string;
  }) => api.post('/api/v1/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/api/v1/auth/login', data),

  logout: () => api.post('/api/v1/auth/logout'),

  refreshToken: () => api.post('/api/v1/auth/refresh-token'),
};

export const userApi = {
  getProfile: () => api.get('/api/v1/users/profile'),

  updateProfile: (data: any) => api.put('/api/v1/users/profile', data),

  getPublicProfile: (userId: string) =>
    api.get(`/api/v1/users/${userId}/public`),
};

export const matchApi = {
  getMatches: (limit = 20, offset = 0) =>
    api.get(`/api/v1/matches?limit=${limit}&offset=${offset}`),

  getPotentialMatches: (limit = 10) =>
    api.get(`/api/v1/matches/potential?limit=${limit}`),

  createMatch: (targetUserId: string) =>
    api.post('/api/v1/matches', { targetUserId }),

  rejectMatch: (matchId: string) =>
    api.delete(`/api/v1/matches/${matchId}`),
};

export const chatApi = {
  sendMessage: (recipientId: string, content: string) =>
    api.post('/api/v1/chat/messages', { recipientId, content }),

  getConversation: (otherUserId: string, limit = 50) =>
    api.get(`/api/v1/chat/${otherUserId}?limit=${limit}`),

  getConversations: () => api.get('/api/v1/chat/conversations'),

  markAsRead: (messageId: string) =>
    api.post(`/api/v1/chat/messages/${messageId}/read`),
};

export default api;
