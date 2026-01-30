import api from './api';
import { AuthTokens, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  async register(credentials: RegisterCredentials): Promise<{ message: string }> { 
    const response = await api.post('/auth/register/', {
    email: credentials.email,
    password: credentials.password,
    password2: credentials.password2,
    });
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await api.post('/auth/login/', {
      username: credentials.email,
      password: credentials.password,
    });
    const tokens = response.data;
    
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    
    return tokens;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },
};