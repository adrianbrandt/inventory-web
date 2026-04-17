import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { me, login as apiLogin, logout as apiLogout } from '../api/auth';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const { data, isPending } = useQuery<AuthUser | null>({
    queryKey: ['auth-me'],
    queryFn: () => me().catch(() => null),
    staleTime: Infinity,
    retry: false,
  });

  const login = async (username: string, password: string) => {
    const u = await apiLogin(username, password);
    qc.setQueryData(['auth-me'], u);
  };

  const logout = async () => {
    await apiLogout();
    qc.setQueryData(['auth-me'], null);
    qc.removeQueries({ queryKey: ['parts'] });
    qc.removeQueries({ queryKey: ['stats'] });
  };

  return <AuthContext.Provider value={{ user: data ?? null, loading: isPending, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
