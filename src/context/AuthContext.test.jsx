import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { authApi } from '../api/auth.api';

vi.mock('../api/auth.api');

// Test component to access context
function TestComponent() {
  const { user, token, isAuthenticated, loading, error, login, logout, updateUser } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('test@example.com', 'password');
    } catch (e) {
      // Error is already set in context state
    }
  };
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'null'}</div>
      <div data-testid="token">{token || 'null'}</div>
      <div data-testid="isAuthenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="error">{error || 'null'}</div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => updateUser({ name: 'Updated Name' })}>Update</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('AuthProvider', () => {
    it('should provide initial unauthenticated state', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('token')).toHaveTextContent('null');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('error')).toHaveTextContent('null');
    });

    it('should load session from localStorage on mount', () => {
      const mockToken = 'mock-token';
      const mockUser = { _id: '1', name: 'Test User', email: 'test@example.com' };
      
      localStorage.setItem('access_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
      expect(screen.getByTestId('token')).toHaveTextContent('mock-token');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('user', 'invalid-json{');

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('token')).toHaveTextContent('null');
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        accessToken: 'new-token',
        user: { _id: '1', name: 'Test User', email: 'test@example.com' },
      };

      authApi.login.mockResolvedValue(mockResponse);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('Test User');
      });

      expect(screen.getByTestId('token')).toHaveTextContent('new-token');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      expect(localStorage.getItem('access_token')).toBe('new-token');
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockResponse.user);
    });

    it('should handle login error with string message', async () => {
      const user = userEvent.setup();
      const mockError = {
        response: { data: { message: 'Invalid credentials' } },
      };

      authApi.login.mockRejectedValue(mockError);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
      });

      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    });

    it('should handle login error with array message', async () => {
      const user = userEvent.setup();
      const mockError = {
        response: { data: { message: ['Error 1', 'Error 2'] } },
      };

      authApi.login.mockRejectedValue(mockError);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Error 1, Error 2');
      });
    });

    it('should handle login error without response data', async () => {
      const user = userEvent.setup();
      const mockError = new Error('Network error');

      authApi.login.mockRejectedValue(mockError);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });
    });

    it('should set loading state during login', async () => {
      const user = userEvent.setup();
      authApi.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText('Login'));

      expect(screen.getByTestId('loading')).toHaveTextContent('true');
    });
  });

  describe('logout', () => {
    it('should logout and clear session', async () => {
      const user = userEvent.setup();
      
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('user', JSON.stringify({ name: 'User' }));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');

      await user.click(screen.getByText('Logout'));

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('token')).toHaveTextContent('null');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const user = userEvent.setup();
      const mockUser = { _id: '1', name: 'Original Name', email: 'test@example.com' };
      
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user')).toHaveTextContent('Original Name');

      await user.click(screen.getByText('Update'));

      expect(screen.getByTestId('user')).toHaveTextContent('Updated Name');
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser.name).toBe('Updated Name');
      expect(storedUser.email).toBe('test@example.com');
    });
  });

  describe('auth:logout event', () => {
    it('should logout when auth:logout event is dispatched', async () => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('user', JSON.stringify({ name: 'User' }));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');

      // Simulate axios interceptor dispatching auth:logout event
      window.dispatchEvent(new Event('auth:logout'));

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('token')).toHaveTextContent('null');
    });
  });

  describe('useAuth', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth debe usarse dentro de <AuthProvider>');

      consoleSpy.mockRestore();
    });
  });
});
