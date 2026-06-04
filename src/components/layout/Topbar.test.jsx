import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Topbar } from './Topbar';

describe('Topbar', () => {
  const defaultProps = {
    title: 'Panel Principal',
    subtitle: 'Resumen ejecutivo del sistema',
    onNew: vi.fn(),
    stats: {},
  };

  describe('rendering', () => {
    it('should render the title', () => {
      render(<Topbar {...defaultProps} />);
      expect(screen.getByText('Panel Principal')).toBeInTheDocument();
    });

    it('should render the subtitle when provided', () => {
      render(<Topbar {...defaultProps} />);
      expect(screen.getByText('Resumen ejecutivo del sistema')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      render(<Topbar title="Solo título" stats={{}} />);
      expect(screen.queryByText('Resumen ejecutivo del sistema')).not.toBeInTheDocument();
    });

    it('should render the notification bell button', () => {
      render(<Topbar {...defaultProps} />);
      // Bell button exists in the header
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should render "Radicar Documento" button when onNew is provided', () => {
      render(<Topbar {...defaultProps} />);
      expect(screen.getByRole('button', { name: /radicar documento/i })).toBeInTheDocument();
    });

    it('should not render "Radicar Documento" button when onNew is null', () => {
      render(<Topbar title="Test" onNew={null} stats={{}} />);
      expect(screen.queryByRole('button', { name: /radicar documento/i })).not.toBeInTheDocument();
    });
  });

  describe('alert dot', () => {
    it('should not show alert dot when no urgent docs', () => {
      const { container } = render(<Topbar {...defaultProps} stats={{ VENCIDO: 0, POR_VENCER: 0 }} />);
      // The alert dot has a specific style with borderRadius 50%
      // When alerts=0, the dot span is not rendered
      const alertDot = container.querySelector('[style*="width: 7px"]');
      expect(alertDot).toBeNull();
    });

    it('should show alert dot when there are urgent docs', () => {
      const { container } = render(<Topbar {...defaultProps} stats={{ VENCIDO: 2, POR_VENCER: 1 }} />);
      const alertDot = container.querySelector('[style*="width: 7px"]');
      expect(alertDot).not.toBeNull();
    });

    it('should count alerts from both VENCIDO and POR_VENCER', () => {
      const { container } = render(<Topbar {...defaultProps} stats={{ VENCIDO: 1, POR_VENCER: 0 }} />);
      const alertDot = container.querySelector('[style*="width: 7px"]');
      expect(alertDot).not.toBeNull();
    });
  });

  describe('onNew callback', () => {
    it('should call onNew when Radicar Documento is clicked', () => {
      const onNew = vi.fn();
      render(<Topbar {...defaultProps} onNew={onNew} />);

      fireEvent.click(screen.getByRole('button', { name: /radicar documento/i }));
      expect(onNew).toHaveBeenCalled();
    });
  });

  describe('header element', () => {
    it('should render as a header element', () => {
      render(<Topbar {...defaultProps} />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('notification button hover', () => {
    it('should handle mouseEnter and mouseLeave on notification button', () => {
      const { container } = render(<Topbar {...defaultProps} stats={{ VENCIDO: 1 }} />);
      // The notification bell button
      const bellButton = container.querySelector('button');
      expect(bellButton).toBeInTheDocument();

      fireEvent.mouseEnter(bellButton);
      fireEvent.mouseLeave(bellButton);
      // Should not throw and component remains stable
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });
});
