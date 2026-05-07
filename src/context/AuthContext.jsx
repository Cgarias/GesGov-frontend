import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'access_token';
const USER_KEY  = 'user';

function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function loadSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw   = localStorage.getItem(USER_KEY);
  if (!token || !raw) return { token: null, user: null };
  try {
    return { token, user: JSON.parse(raw) };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const initial = loadSession();

  const [user,    setUser]    = useState(initial.user);
  const [token,   setToken]   = useState(initial.token);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const isAuthenticated = !!token && !!user;

  // Escuchar el evento que dispara el interceptor de axios cuando recibe 401
  useEffect(() => {
    const handleForceLogout = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      saveSession(data.accessToken, data.user);
      setToken(data.accessToken);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al iniciar sesión';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem(USER_KEY, JSON.stringify(merged));
    setUser(merged);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, loading, error, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
