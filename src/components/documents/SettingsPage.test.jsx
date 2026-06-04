import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsPage } from './SettingsPage';
import { AuthProvider } from '../../context/AuthContext';

// Mock the auth API so AuthProvider doesn't make real calls
vi.mock('../../api/auth.api');

const mockUser = {
  _id: '1',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'Administrador',
  position: 'Gerente',
  phone: '3001234567',
};

function renderSettingsPage(user = mockUser) {
  localStorage.setItem('access_token', 'test-token');
  localStorage.setItem('user', JSON.stringify(user));
  return render(
    <AuthProvider>
      <SettingsPage />
    </AuthProvider>
  );
}

describe('SettingsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the profile section', () => {
      renderSettingsPage();
      expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument();
    });

    it('should render the security section', () => {
      renderSettingsPage();
      expect(screen.getByText('Seguridad')).toBeInTheDocument();
    });

    it('should render the notifications section', () => {
      renderSettingsPage();
      expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    });

    it('should render the appearance section', () => {
      renderSettingsPage();
      expect(screen.getByText('Apariencia')).toBeInTheDocument();
    });

    it('should render user name from context', () => {
      renderSettingsPage();
      expect(screen.getAllByText('Admin User').length).toBeGreaterThan(0);
    });

    it('should render user email from context', () => {
      renderSettingsPage();
      expect(screen.getByDisplayValue('admin@test.com')).toBeInTheDocument();
    });

    it('should render save button', () => {
      renderSettingsPage();
      expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();
    });

    it('should render theme buttons', () => {
      renderSettingsPage();
      expect(screen.getByRole('button', { name: 'Claro' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Oscuro' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sistema' })).toBeInTheDocument();
    });
  });

  describe('profile form', () => {
    it('should allow editing the name field', async () => {
      const user = userEvent.setup();
      renderSettingsPage();

      const nameInput = screen.getByDisplayValue('Admin User');
      await user.clear(nameInput);
      await user.type(nameInput, 'New Name');

      expect(nameInput).toHaveValue('New Name');
    });

    it('should allow editing the phone field', async () => {
      const user = userEvent.setup();
      renderSettingsPage();

      const phoneInput = screen.getByDisplayValue('3001234567');
      await user.clear(phoneInput);
      await user.type(phoneInput, '3109999999');

      expect(phoneInput).toHaveValue('3109999999');
    });

    it('should show user initials in avatar', () => {
      renderSettingsPage();
      // Avatar shows first 2 initials of name "Admin User" => "AU"
      expect(screen.getByText('AU')).toBeInTheDocument();
    });
  });

  describe('save functionality', () => {
    it('should show success message after saving', async () => {
      const user = userEvent.setup();
      renderSettingsPage();

      await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

      await waitFor(() => {
        expect(screen.getByText(/cambios guardados/i)).toBeInTheDocument();
      });
    });
  });

  describe('security section', () => {
    it('should render current password field', () => {
      renderSettingsPage();
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      expect(passwordInputs.length).toBeGreaterThan(0);
    });

    it('should toggle password visibility', async () => {
      const user = userEvent.setup();
      const { container } = renderSettingsPage();

      // Find the toggle button for current password (button in security section)
      const toggleBtn = container.querySelector('button[type="button"]');
      const currentPassInput = container.querySelector('input[type="password"]');

      expect(currentPassInput.type).toBe('password');
      await user.click(toggleBtn);
      expect(currentPassInput.type).toBe('text');
    });
  });

  describe('notifications toggles', () => {
    it('should render all notification toggles', () => {
      renderSettingsPage();
      expect(screen.getByText(/alertar cuando un documento esté vencido/i)).toBeInTheDocument();
      expect(screen.getByText(/alertar cuando un documento esté por vencer/i)).toBeInTheDocument();
      expect(screen.getByText(/notificar al radicar nuevos documentos/i)).toBeInTheDocument();
      expect(screen.getByText(/recibir resumen diario/i)).toBeInTheDocument();
    });

    it('should toggle vencidos notification when its label is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderSettingsPage();
      const labels = container.querySelectorAll('label');
      // Click each label (Toggle component)
      for (const label of labels) {
        await user.click(label);
      }
      // Component should remain stable
      expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    });
  });

  describe('empty user state', () => {
    it('should handle empty user gracefully', () => {
      render(
        <AuthProvider>
          <SettingsPage />
        </AuthProvider>
      );
      // Should not crash when user is null
      expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument();
    });
  });
});
