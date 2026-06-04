import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from './auth.api';
import api from './axios.config';

vi.mock('./axios.config', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call API with correct credentials', async () => {
      const mockResponse = {
        data: {
          accessToken: 'mock-token',
          user: { id: '1', email: 'test@example.com' },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authApi.login('test@example.com', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error', async () => {
      const mockError = new Error('Invalid credentials');
      api.post.mockRejectedValue(mockError);

      await expect(authApi.login('wrong@example.com', 'wrong')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('register', () => {
    it('should register new user with payload', async () => {
      const payload = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'SECRETARY',
      };

      const mockResponse = {
        data: {
          accessToken: 'mock-token',
          user: { id: '2', ...payload },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authApi.register(payload);

      expect(api.post).toHaveBeenCalledWith('/auth/register', payload);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle registration error', async () => {
      const mockError = new Error('Email already exists');
      api.post.mockRejectedValue(mockError);

      await expect(
        authApi.register({ email: 'existing@example.com', password: 'pass' })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('getMe', () => {
    it('should fetch current user profile', async () => {
      const mockResponse = {
        data: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN',
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await authApi.getMe();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle unauthorized error', async () => {
      const mockError = new Error('Unauthorized');
      api.get.mockRejectedValue(mockError);

      await expect(authApi.getMe()).rejects.toThrow('Unauthorized');
    });
  });
});
