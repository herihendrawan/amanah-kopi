import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext({});
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } });
  const [token,   setToken]   = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const saveAuth = (u, t) => {
    setUser(u); setToken(t);
    localStorage.setItem('user',  JSON.stringify(u));
    localStorage.setItem('token', t);
  };

  const clearAuth = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const login = async (email, password) => {
    setLoading(true);
    const res  = await fetch(`${API}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) throw new Error(data.message);
    saveAuth(data.user, data.token);
    return data.user;
  };

  const register = async (name, email, password) => {
    setLoading(true);
    const res  = await fetch(`${API}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) throw new Error(data.errors?.[0]?.msg || data.message);
    saveAuth(data.user, data.token);
    return data.user;
  };

  const logout = () => clearAuth();

  const authHeader = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authHeader, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
