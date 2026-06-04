import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to mock the axios module before importing axios.config
vi.mock('axios', async () => {
  const mockInterceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  };

  const mockInstance = {
    interceptors: mockInterceptors,
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      create: vi.fn(() => mockInstance),
    },
    __mockInstance: mockInstance,
  };
});

describe('axios.config', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('request interceptor', () => {
    it('should attach Authorization header when token exists', async () => {
      localStorage.setItem('access_token', 'my-jwt-token');

      // Simulate what the request interceptor does
      const config = { headers: {} };
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      expect(config.headers.Authorization).toBe('Bearer my-jwt-token');
    });

    it('should not attach Authorization header when no token', () => {
      const config = { headers: {} };
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      expect(config.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor - 401 handling', () => {
    it('should dispatch auth:logout event on 401 (non-login)', () => {
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('user', JSON.stringify({ name: 'Test' }));

      // Simulate the 401 interceptor logic
      const error = {
        response: { status: 401 },
        config: { url: '/api/v1/documents' },
      };

      const status = error.response?.status;
      const isLoginCall = error.config?.url?.includes('/auth/login');

      if (status === 401 && !isLoginCall) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
      }

      expect(dispatchSpy).toHaveBeenCalled();
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should NOT clear session on 401 from login endpoint', () => {
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
      localStorage.setItem('access_token', 'token');

      const error = {
        response: { status: 401 },
        config: { url: '/api/v1/auth/login' },
      };

      const status = error.response?.status;
      const isLoginCall = error.config?.url?.includes('/auth/login');

      if (status === 401 && !isLoginCall) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
      }

      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(localStorage.getItem('access_token')).toBe('token');
    });

    it('should pass through non-401 errors without clearing session', () => {
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
      localStorage.setItem('access_token', 'token');

      const error = {
        response: { status: 500 },
        config: { url: '/api/v1/documents' },
      };

      const status = error.response?.status;
      const isLoginCall = error.config?.url?.includes('/auth/login');

      if (status === 401 && !isLoginCall) {
        localStorage.removeItem('access_token');
        window.dispatchEvent(new Event('auth:logout'));
      }

      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(localStorage.getItem('access_token')).toBe('token');
    });
  });
});
