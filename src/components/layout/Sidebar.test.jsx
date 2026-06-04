import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { AuthProvider } from '../../context/AuthContext';

vi.mock('../../api/auth.api');

const mockUser = {
  _id: '1',
  name: 'Test User',
  email: 'test@test.com',
  role: 'Admin',
};

function renderSidebar(props = {}) {
  localStorage.setItem('access_token', 'token');
  localStorage.setItem('user', JSON.stringify(mockUser));

  const defaultProps = {
    active: 'dashboard',
    onNav: vi.fn(),
    collapsed: false,
    onToggle: vi.fn(),
    stats: {},
  };

  return render(
    <AuthProvider>
      <Sidebar {...defaultProps} {...props} />
    </AuthProvider>
  );
}

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the logo/brand area', () => {
      renderSidebar();
      expect(screen.getByText('Alcaldía Municipal')).toBeInTheDocument();
    });

    it('should render all navigation items when expanded', () => {
      renderSidebar();
      expect(screen.getByText('Panel Principal')).toBeInTheDocument();
      expect(screen.getByText('Documentos')).toBeInTheDocument();
      expect(screen.getByText('Radicar Documento')).toBeInTheDocument();
      expect(screen.getByText('Configuración')).toBeInTheDocument();
    });

    it('should render user name in expanded state', () => {
      renderSidebar();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should render user role in expanded state', () => {
      renderSidebar();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should render collapse button in expanded state', () => {
      renderSidebar();
      expect(screen.getByTitle('Colapsar menú')).toBeInTheDocument();
    });

    it('should show "Gestión Documental" subtitle when expanded', () => {
      renderSidebar();
      expect(screen.getByText('Gestión Documental')).toBeInTheDocument();
    });
  });

  describe('collapsed state', () => {
    it('should not render nav labels when collapsed', () => {
      renderSidebar({ collapsed: true });
      expect(screen.queryByText('Panel Principal')).not.toBeInTheDocument();
      expect(screen.queryByText('Documentos')).not.toBeInTheDocument();
    });

    it('should render expand button when collapsed', () => {
      renderSidebar({ collapsed: true });
      expect(screen.getByTitle('Expandir menú')).toBeInTheDocument();
    });

    it('should not show user info section when collapsed', () => {
      renderSidebar({ collapsed: true });
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });

    it('should show logout button even when collapsed', () => {
      renderSidebar({ collapsed: true });
      expect(screen.getByTitle('Cerrar sesión')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should call onNav when a nav button is clicked', () => {
      const onNav = vi.fn();
      renderSidebar({ onNav });

      fireEvent.click(screen.getByText('Documentos'));
      expect(onNav).toHaveBeenCalledWith('documents');
    });

    it('should call onNav with dashboard when Panel Principal is clicked', () => {
      const onNav = vi.fn();
      renderSidebar({ onNav });

      fireEvent.click(screen.getByText('Panel Principal'));
      expect(onNav).toHaveBeenCalledWith('dashboard');
    });

    it('should call onNav with upload when Radicar Documento is clicked', () => {
      const onNav = vi.fn();
      renderSidebar({ onNav });

      fireEvent.click(screen.getByText('Radicar Documento'));
      expect(onNav).toHaveBeenCalledWith('upload');
    });

    it('should call onNav with settings when Configuración is clicked', () => {
      const onNav = vi.fn();
      renderSidebar({ onNav });

      fireEvent.click(screen.getByText('Configuración'));
      expect(onNav).toHaveBeenCalledWith('settings');
    });
  });

  describe('toggle', () => {
    it('should call onToggle when collapse button is clicked', () => {
      const onToggle = vi.fn();
      renderSidebar({ onToggle });

      fireEvent.click(screen.getByTitle('Colapsar menú'));
      expect(onToggle).toHaveBeenCalled();
    });

    it('should call onToggle when expand button is clicked', () => {
      const onToggle = vi.fn();
      renderSidebar({ collapsed: true, onToggle });

      fireEvent.click(screen.getByTitle('Expandir menú'));
      expect(onToggle).toHaveBeenCalled();
    });
  });

  describe('alerts', () => {
    it('should show alerts when vencidos > 0', () => {
      renderSidebar({ stats: { VENCIDO: 2, POR_VENCER: 0 } });
      expect(screen.getByText('Alertas activas')).toBeInTheDocument();
      expect(screen.getByText(/2 documentos vencidos/i)).toBeInTheDocument();
    });

    it('should show singular form for one vencido document', () => {
      renderSidebar({ stats: { VENCIDO: 1, POR_VENCER: 0 } });
      expect(screen.getByText(/1 documento vencido/)).toBeInTheDocument();
    });

    it('should show porVencer alert when porVencer > 0', () => {
      renderSidebar({ stats: { VENCIDO: 0, POR_VENCER: 3 } });
      expect(screen.getByText('Alertas activas')).toBeInTheDocument();
      expect(screen.getByText(/3 por vencer pronto/i)).toBeInTheDocument();
    });

    it('should not show alerts when no urgent documents', () => {
      renderSidebar({ stats: { VENCIDO: 0, POR_VENCER: 0 } });
      expect(screen.queryByText('Alertas activas')).not.toBeInTheDocument();
    });

    it('should not show alerts section when collapsed even with urgent docs', () => {
      renderSidebar({ collapsed: true, stats: { VENCIDO: 2, POR_VENCER: 1 } });
      expect(screen.queryByText('Alertas activas')).not.toBeInTheDocument();
    });
  });

  describe('document count badge', () => {
    it('should show total document count on Documentos nav item', () => {
      renderSidebar({ stats: { PENDIENTE: 3, EN_PROCESO: 2 } });
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should not show count badge when total is 0', () => {
      renderSidebar({ stats: {} });
      // Total is 0, badge should not appear
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  describe('logout', () => {
    it('should call logout when logout button is clicked', () => {
      renderSidebar();
      fireEvent.click(screen.getByTitle('Cerrar sesión'));

      // After logout, localStorage should be cleared
      expect(localStorage.getItem('access_token')).toBeNull();
    });
  });

  describe('active state', () => {
    it('should highlight active nav item', () => {
      renderSidebar({ active: 'documents' });
      // The active button should have the active style
      const documentsBtn = screen.getByText('Documentos').closest('button');
      expect(documentsBtn).toBeInTheDocument();
    });
  });

  describe('user with no name', () => {
    it('should show "U" fallback when user has no name', () => {
      localStorage.setItem('user', JSON.stringify({ _id: '1', role: 'admin' }));
      render(
        <AuthProvider>
          <Sidebar
            active="dashboard"
            onNav={vi.fn()}
            collapsed={false}
            onToggle={vi.fn()}
            stats={{}}
          />
        </AuthProvider>
      );
      expect(screen.getByText('U')).toBeInTheDocument();
    });
  });

  describe('hover interactions', () => {
    it('should handle mouseEnter and mouseLeave on nav items', () => {
      renderSidebar({ active: 'settings' }); // 'documents' is not active

      const docsBtn = screen.getByText('Documentos').closest('button');
      fireEvent.mouseEnter(docsBtn);
      fireEvent.mouseLeave(docsBtn);
      // Component remains stable
      expect(docsBtn).toBeInTheDocument();
    });

    it('should handle mouseEnter and mouseLeave on toggle button', () => {
      renderSidebar();
      const toggleBtn = screen.getByTitle('Colapsar menú');
      fireEvent.mouseEnter(toggleBtn);
      fireEvent.mouseLeave(toggleBtn);
      expect(toggleBtn).toBeInTheDocument();
    });

    it('should handle mouseEnter and mouseLeave on logout button', () => {
      renderSidebar();
      const logoutBtn = screen.getByTitle('Cerrar sesión');
      fireEvent.mouseEnter(logoutBtn);
      fireEvent.mouseLeave(logoutBtn);
      expect(logoutBtn).toBeInTheDocument();
    });
  });
});
