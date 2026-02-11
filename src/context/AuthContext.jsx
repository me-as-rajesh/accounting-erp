import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setToken = (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  };

  const refreshMe = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    const { data } = await api.get('/auth/me');
    setUser(data.user);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshMe]);

  const login = useCallback(async ({ username, password }) => {
    const { data } = await api.post('/auth/login', { username, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ fullName, username, password }) => {
    const { data } = await api.post('/auth/register', { fullName, username, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const selectCompany = useCallback(
    async (companyId) => {
      const { data } = await api.post(`/companies/${companyId}/select`);
      setUser((prev) => (prev ? { ...prev, activeCompany: data.company._id } : prev));
      return data.company;
    },
    []
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      activeCompanyId: user?.activeCompany || null,
      login,
      register,
      logout,
      refreshMe,
      selectCompany
    }),
    [user, loading, login, register, logout, refreshMe, selectCompany]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
