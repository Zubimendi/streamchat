import { create } from 'zustand';
import { type User } from '../types';
import { authService } from '../services/auth.service';
import { socketService } from '../services/socket.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authService.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      socketService.connect(token);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authService.register(username, email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      socketService.connect(token);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      socketService.disconnect();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));