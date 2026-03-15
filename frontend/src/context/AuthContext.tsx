import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'lti_auth';

export interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStored(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const data = JSON.parse(raw) as { token: string; user: User };
    if (data.token && data.user) return { token: data.token, user: data.user };
  } catch {
    // ignore
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(loadStored);

  useEffect(() => {
    if (state.token && state.user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: state.token, user: state.user }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.token, state.user]);

  const login = useCallback(async (email: string, password: string) => {
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3010';
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Login failed');
    }
    const data = await res.json();
    setState({ token: data.token, user: data.user });
  }, []);

  const logout = useCallback(() => {
    setState({ token: null, user: null });
  }, []);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!state.token) return {};
    return { Authorization: `Bearer ${state.token}` };
  }, [state.token]);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    getAuthHeaders,
    isAuthenticated: !!state.token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
