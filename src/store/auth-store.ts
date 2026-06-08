import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  chatPlatformId?: string;
  position?: string;
  phone?: string;
  telegram?: string;
  timezone?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true });
    const { loginUser } = await import('@/lib/api');
    const user = await loginUser({ username, password });
    set({ user, isLoading: false });
  },

  register: async (username, password, name) => {
    set({ isLoading: true });
    const { registerUser } = await import('@/lib/api');
    const user = await registerUser({ username, password, name });
    set({ user, isLoading: false });
  },

  logout: () => {
    set({ user: null });
  },

  checkAuth: async () => {},
}));