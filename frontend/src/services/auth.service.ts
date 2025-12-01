import api from './api';
import { type User } from '../types';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authService = {
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await api.post('/auth/refresh-token', { refreshToken });
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.token;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data.user;
  },
};
