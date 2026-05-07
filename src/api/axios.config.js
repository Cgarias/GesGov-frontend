import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: adjuntar token JWT si existe ────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: manejar 401 ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status      = error.response?.status;
    const isLoginCall = error.config?.url?.includes('/auth/login');

    // Solo limpiar sesión si el 401 NO viene del propio login
    if (status === 401 && !isLoginCall) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Disparar evento para que AuthContext reaccione sin recargar la página
      window.dispatchEvent(new Event('auth:logout'));
    }

    return Promise.reject(error);
  },
);

export default api;
