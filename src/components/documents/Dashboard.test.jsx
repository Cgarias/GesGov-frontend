import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  const mockStats = {
    PENDIENTE: 5,
    EN_PROCESO: 3,
    POR_VENCER: 2,
    VENCIDO: 1,
    RESPONDIDO: 4,
  };

  const defaultProps = {
    stats: mockStats,
    loading: false,
    error: null,
    onNav: vi.fn(),
    onRetry: vi.fn(),
  };

  describe('loading state', () => {
    it('should show loading message when loading is true', () => {
      render(<Dashboard {...defaultProps} loading={true} />);
      expect(screen.getByText('Cargando estadísticas...')).toBeInTheDocument();
    });

    it('should not render stats when loading', () => {
      render(<Dashboard {...defaultProps} loading={true} />);
      expect(screen.queryByText('Total Documentos')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error message when error is set', () => {
      render(<Dashboard {...defaultProps} error="Error de conexión" />);
      expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    });

    it('should show retry button on error', () => {
      render(<Dashboard {...defaultProps} error="Error" />);
      expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
      const onRetry = vi.fn();
      render(<Dashboard {...defaultProps} error="Error" onRetry={onRetry} />);
      fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe('stats display', () => {
    it('should render all stat cards', () => {
      render(<Dashboard {...defaultProps} />);
      expect(screen.getByText('Total Documentos')).toBeInTheDocument();
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
      expect(screen.getByText('Por Vencer')).toBeInTheDocument();
      expect(screen.getByText('Vencidos')).toBeInTheDocument();
      expect(screen.getByText('Respondidos')).toBeInTheDocument();
      expect(screen.getByText('Pendientes')).toBeInTheDocument();
    });

    it('should calculate and display total documents', () => {
      render(<Dashboard {...defaultProps} />);
      const total = Object.values(mockStats).reduce((s, v) => s + v, 0); // 15
      // total appears in both the banner and the stat card
      const elements = screen.getAllByText(total.toString());
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    it('should display individual stat counts', () => {
      render(<Dashboard {...defaultProps} />);
      expect(screen.getByText('5')).toBeInTheDocument(); // PENDIENTE
      expect(screen.getByText('3')).toBeInTheDocument(); // EN_PROCESO
      expect(screen.getByText('4')).toBeInTheDocument(); // RESPONDIDO
    });

    it('should show urgency alert when there are VENCIDO or POR_VENCER docs', () => {
      render(<Dashboard {...defaultProps} />);
      // VENCIDO(1) + POR_VENCER(2) = 3 requieren atención
      expect(screen.getByText(/requieren atención/i)).toBeInTheDocument();
    });

    it('should not show urgency alert when no urgent documents', () => {
      const safeStats = { PENDIENTE: 5, EN_PROCESO: 3, POR_VENCER: 0, VENCIDO: 0, RESPONDIDO: 4 };
      render(<Dashboard {...defaultProps} stats={safeStats} />);
      expect(screen.queryByText(/requieren atención/i)).not.toBeInTheDocument();
    });

    it('should display 0 for stats not present', () => {
      render(<Dashboard {...defaultProps} stats={{}} />);
      // All stat cards should show 0
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThan(0);
    });
  });

  describe('navigation', () => {
    it('should render "Ver Documentos" button', () => {
      render(<Dashboard {...defaultProps} />);
      expect(screen.getByRole('button', { name: /ver documentos/i })).toBeInTheDocument();
    });

    it('should call onNav with "documents" when button is clicked', () => {
      const onNav = vi.fn();
      render(<Dashboard {...defaultProps} onNav={onNav} />);
      fireEvent.click(screen.getByRole('button', { name: /ver documentos/i }));
      expect(onNav).toHaveBeenCalledWith('documents');
    });
  });

  describe('banner content', () => {
    it('should render the system banner', () => {
      render(<Dashboard {...defaultProps} />);
      expect(screen.getByText('Sistema de Gestión Documental')).toBeInTheDocument();
    });

    it('should render the SISTEMA ACTIVO tag', () => {
      render(<Dashboard {...defaultProps} />);
      expect(screen.getByText(/sistema activo/i)).toBeInTheDocument();
    });
  });
});
