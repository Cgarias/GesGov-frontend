import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';

vi.mock('../../api/auth.api');

// Wrap LoginPage with AuthProvider for all tests
function renderLoginPage() {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the login form', () => {
      renderLoginPage();
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    });

    it('should render email input', () => {
      renderLoginPage();
      expect(screen.getByPlaceholderText('usuario@alcaldia.gov.co')).toBeInTheDocument();
    });

    it('should render password input', () => {
      renderLoginPage();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderLoginPage();
      expect(screen.getByRole('button', { name: /ingresar al sistema/i })).toBeInTheDocument();
    });

    it('should render demo credentials section', () => {
      renderLoginPage();
      expect(screen.getByText(/credenciales de acceso inicial/i)).toBeInTheDocument();
      expect(screen.getByText('admin@alcaldia.gov.co')).toBeInTheDocument();
    });

    it('should render left panel features in non-mobile view', () => {
      renderLoginPage();
      expect(screen.getByText('Control de tiempos de respuesta')).toBeInTheDocument();
      expect(screen.getByText('Seguimiento de documentos')).toBeInTheDocument();
      expect(screen.getByText(/alertas automáticas/i)).toBeInTheDocument();
    });

    it('should show current year in footer', () => {
      renderLoginPage();
      const year = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('should show error when email is empty on submit', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.click(screen.getByRole('button', { name: /ingresar/i }));

      expect(screen.getByText('El correo es requerido')).toBeInTheDocument();
    });

    it('should show error when email format is invalid', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByPlaceholderText('usuario@alcaldia.gov.co'), 'invalid-email');
      await user.click(screen.getByRole('button', { name: /ingresar/i }));

      expect(screen.getByText('Correo no válido')).toBeInTheDocument();
    });

    it('should show error when password is empty on submit', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByPlaceholderText('usuario@alcaldia.gov.co'), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /ingresar/i }));

      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();
    });

    it('should clear email validation error when user types', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      // Trigger validation error
      await user.click(screen.getByRole('button', { name: /ingresar/i }));
      expect(screen.getByText('El correo es requerido')).toBeInTheDocument();

      // Type to clear the error
      await user.type(screen.getByPlaceholderText('usuario@alcaldia.gov.co'), 'a');
      expect(screen.queryByText('El correo es requerido')).not.toBeInTheDocument();
    });

    it('should clear password validation error when user types', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByPlaceholderText('usuario@alcaldia.gov.co'), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /ingresar/i }));
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();

      const passwordInput = screen.getByPlaceholderText('••••••••');
      await user.type(passwordInput, 'a');
      expect(screen.queryByText('La contraseña es requerida')).not.toBeInTheDocument();
    });
  });

  describe('password visibility toggle', () => {
    it('should start with password hidden', () => {
      renderLoginPage();
      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should toggle password visibility when button is clicked', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const passwordInput = screen.getByPlaceholderText('••••••••');
      // Find the toggle button (it's the only button of type="button" near password)
      const toggleButtons = screen.getAllByRole('button', { name: '' });
      const toggleBtn = toggleButtons.find((btn) => btn.type === 'button' && !btn.form);

      expect(passwordInput).toHaveAttribute('type', 'password');

      // Use the parent container to find the toggle button correctly
      const { container } = render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );
      const eyeButton = container.querySelector('button[type="button"]');
      await userEvent.click(eyeButton);

      const inputs = container.querySelectorAll('input');
      const passInput = Array.from(inputs).find((i) => i.id === 'password');
      expect(passInput.type).toBe('text');
    });
  });

  describe('form submission', () => {
    it('should call login with correct credentials on valid submit', async () => {
      const user = userEvent.setup();
      authApi.login.mockResolvedValue({
        accessToken: 'token',
        user: { _id: '1', name: 'Test User', email: 'test@example.com' },
      });

      renderLoginPage();

      await user.type(screen.getByPlaceholderText('usuario@alcaldia.gov.co'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /ingresar/i }));

      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveLogin;
      authApi.login.mockImplementation(
        () => new Promise((resolve) => { resolveLogin = resolve; })
      );

      renderLoginPage();

      await user.type(screen.getByPlaceholderText('usuario@alcaldia.gov.co'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /ingresar/i }));

      await waitFor(() => {
        expect(screen.getByText('Verificando...')).toBeInTheDocument();
      });

      resolveLogin({ accessToken: 'token', user: {} });
    });

    it('should show context error when login fails', async () => {
      const user = userEvent.setup();
      authApi.login.mockRejectedValue({
        response: { data: { message: 'Credenciales inválidas' } },
      });

      renderLoginPage();

      await user.type(screen.getByPlaceholderText('usuario@alcaldia.gov.co'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /ingresar/i }));

      await waitFor(() => {
        expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
      });
    });

    it('should not call login when validation fails', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.click(screen.getByRole('button', { name: /ingresar/i }));

      expect(authApi.login).not.toHaveBeenCalled();
    });
  });
});
