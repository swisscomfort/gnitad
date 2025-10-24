import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to request headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  register: (data: {
    pseudonym: string;
    email: string;
    password: string;
    ageRange: string;
  }) => api.post("/api/v1/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/api/v1/auth/login", data),

  logout: () => api.post("/api/v1/auth/logout"),
};

export const matchApi = {
  getMatches: (limit = 20, offset = 0) =>
    api.get(`/api/v1/matches?limit=${limit}&offset=${offset}`),

  getPotentialMatches: (limit = 10) =>
    api.get(`/api/v1/matches/potential?limit=${limit}`),

  createMatch: (targetUserId: string) =>
    api.post("/api/v1/matches", { targetUserId }),

  rejectMatch: (matchId: string) => api.delete(`/api/v1/matches/${matchId}`),
};

export const chatApi = {
  sendMessage: (recipientId: string, content: string) =>
    api.post("/api/v1/chat/messages", { recipientId, content }),

  getConversation: (otherUserId: string, limit = 50) =>
    api.get(`/api/v1/chat/${otherUserId}?limit=${limit}`),

  getConversations: () => api.get("/api/v1/chat/conversations"),
};

export default api;
