// inventory-web/src/api/auth.ts
import { api } from './client';
import type { AuthUser } from '../types';

export const login = (username: string, password: string) =>
  api.post<AuthUser>('/auth/login', { username, password });

export const logout = () => api.post<void>('/auth/logout', {});

export const me = () => api.get<AuthUser>('/auth/me');
