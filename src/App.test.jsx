import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { authApi } from './api/auth.api';
import { documentsApi } from './api/documents.api';

vi.mock('./api/auth.api');
vi.mock('./api/documents.api');
vi.mock('./styles/globalStyles', () => ({
  injectGlobalStyles: vi.fn(() => () => {}),
}));

function renderApp() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    documentsApi.getAll.mockResolvedValue([]);
    documentsApi.getStats.mockResolvedValue({});
  });

  describe('unauthenticated state', () => {
    it('should show LoginPage when not authenticated', () => {
      renderApp();
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    });

    it('should not show sidebar when not authenticated', () => {
      renderApp();
      expect(screen.queryByText('Panel Principal')).not.toBeInTheDocument();
    });
  });

  describe('authenticated state', () => {
    beforeEach(() => {
      localStorage.setItem('access_token', 'valid-token');
      localStorage.setItem(
        'user',
        JSON.stringify({ _id: '1', name: 'Test User', email: 'test@test.com', role: 'Admin' })
      );
    });

    it('should show main app when authenticated', async () => {
      renderApp();

      await waitFor(() => {
        // "Panel Principal" appears in both sidebar nav and topbar heading
        const elements = screen.getAllByText('Panel Principal');
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should render the sidebar', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Alcaldía Municipal')).toBeInTheDocument();
      });
    });

    it('should render the topbar with dashboard title', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByRole('banner')).toBeInTheDocument();
      });
    });

    it('should show Dashboard as default page', async () => {
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Sistema de Gestión Documental')).toBeInTheDocument();
      });
    });

    it('should navigate to documents list when sidebar item clicked', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Documentos')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Documentos'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/buscar por título/i)).toBeInTheDocument();
      });
    });

    it('should navigate to upload form when sidebar item clicked', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        // "Radicar Documento" appears in both sidebar nav and topbar button
        const elements = screen.getAllByText('Radicar Documento');
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });

      // Click the sidebar nav item (it's a button with the text in a span)
      const sidebarBtn = screen.getAllByText('Radicar Documento').find(
        (el) => el.tagName === 'SPAN' && el.closest('button')
      );
      if (sidebarBtn) {
        await user.click(sidebarBtn.closest('button'));
      } else {
        await user.click(screen.getAllByText('Radicar Documento')[0]);
      }

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Nombre o asunto del documento')).toBeInTheDocument();
      });
    });

    it('should navigate to settings when sidebar item clicked', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Configuración')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Configuración'));

      await waitFor(() => {
        expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument();
      });
    });

    it('should collapse sidebar when toggle is clicked', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        expect(screen.getByTitle('Colapsar menú')).toBeInTheDocument();
      });

      await user.click(screen.getByTitle('Colapsar menú'));

      await waitFor(() => {
        expect(screen.getByTitle('Expandir menú')).toBeInTheDocument();
      });
    });

    it('should navigate to upload when "Radicar Documento" topbar button is clicked', async () => {
      const user = userEvent.setup();
      renderApp();

      await waitFor(() => {
        // The topbar "Radicar Documento" button when on dashboard
        const radButtons = screen.getAllByRole('button', { name: /radicar documento/i });
        expect(radButtons.length).toBeGreaterThan(0);
      });

      const radButton = screen.getAllByRole('button', { name: /radicar documento/i })[0];
      await user.click(radButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Nombre o asunto del documento')).toBeInTheDocument();
      });
    });
  });
});
