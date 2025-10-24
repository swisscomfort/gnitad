import { create } from "zustand";

export interface User {
  id: string;
  pseudonym: string;
  ageRange: string;
  isVerified: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
