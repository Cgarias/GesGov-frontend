import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentsList } from './DocumentsList';

const mockDocuments = [
  {
    _id: '1',
    title: 'Solicitud de información',
    radicado: 'RAD-001',
    status: 'PENDIENTE',
    description: 'Descripción del primer documento',
    responseDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    _id: '2',
    title: 'Respuesta a derecho de petición',
    radicado: 'RAD-002',
    status: 'EN_PROCESO',
    responseDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-16').toISOString(),
  },
  {
    _id: '3',
    title: 'Documento vencido',
    radicado: 'RAD-003',
    status: 'VENCIDO',
    responseDeadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-10').toISOString(),
  },
];

const defaultProps = {
  documents: mockDocuments,
  loading: false,
  error: null,
  onViewDetail: vi.fn(),
  onRetry: vi.fn(),
};

describe('DocumentsList', () => {
  describe('loading state', () => {
    it('should show loading message when loading', () => {
      render(<DocumentsList {...defaultProps} loading={true} />);
      expect(screen.getByText('Cargando documentos...')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error message when error is set', () => {
      render(<DocumentsList {...defaultProps} error="Error al cargar" />);
      expect(screen.getByText('Error al cargar')).toBeInTheDocument();
    });

    it('should call onRetry when retry is clicked', () => {
      const onRetry = vi.fn();
      render(<DocumentsList {...defaultProps} error="Error" onRetry={onRetry} />);
      fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe('document rendering', () => {
    it('should render all documents', () => {
      render(<DocumentsList {...defaultProps} />);
      expect(screen.getByText('Solicitud de información')).toBeInTheDocument();
      expect(screen.getByText('Respuesta a derecho de petición')).toBeInTheDocument();
      expect(screen.getByText('Documento vencido')).toBeInTheDocument();
    });

    it('should render radicado numbers', () => {
      render(<DocumentsList {...defaultProps} />);
      expect(screen.getByText('RAD-001')).toBeInTheDocument();
      expect(screen.getByText('RAD-002')).toBeInTheDocument();
    });

    it('should render document descriptions', () => {
      render(<DocumentsList {...defaultProps} />);
      expect(screen.getByText('Descripción del primer documento')).toBeInTheDocument();
    });

    it('should render status badges', () => {
      render(<DocumentsList {...defaultProps} />);
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
      expect(screen.getByText('Vencido')).toBeInTheDocument();
    });

    it('should show document count in filter bar', () => {
      render(<DocumentsList {...defaultProps} />);
      expect(screen.getByText('3')).toBeInTheDocument(); // filtered count
    });
  });

  describe('empty state', () => {
    it('should show empty message when no documents', () => {
      render(<DocumentsList {...defaultProps} documents={[]} />);
      expect(screen.getByText('No se encontraron documentos')).toBeInTheDocument();
    });

    it('should show message about no registered documents when empty list', () => {
      render(<DocumentsList {...defaultProps} documents={[]} />);
      expect(screen.getByText(/aún no hay documentos registrados/i)).toBeInTheDocument();
    });
  });

  describe('search filtering', () => {
    it('should filter documents by title search', async () => {
      const user = userEvent.setup();
      render(<DocumentsList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/buscar por título/i);
      await user.type(searchInput, 'Solicitud');

      expect(screen.getByText('Solicitud de información')).toBeInTheDocument();
      expect(screen.queryByText('Respuesta a derecho de petición')).not.toBeInTheDocument();
    });

    it('should filter documents by radicado search', async () => {
      const user = userEvent.setup();
      render(<DocumentsList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/buscar por título/i);
      await user.type(searchInput, 'RAD-002');

      expect(screen.getByText('Respuesta a derecho de petición')).toBeInTheDocument();
      expect(screen.queryByText('Solicitud de información')).not.toBeInTheDocument();
    });

    it('should be case-insensitive when searching', async () => {
      const user = userEvent.setup();
      render(<DocumentsList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/buscar por título/i);
      await user.type(searchInput, 'solicitud');

      expect(screen.getByText('Solicitud de información')).toBeInTheDocument();
    });

    it('should show no results message when search has no matches', async () => {
      const user = userEvent.setup();
      render(<DocumentsList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/buscar por título/i);
      await user.type(searchInput, 'zzz-no-existe');

      expect(screen.getByText('No se encontraron documentos')).toBeInTheDocument();
      expect(screen.getByText(/ajusta los filtros/i)).toBeInTheDocument();
    });
  });

  describe('status filter', () => {
    it('should render status select with "Todos" option', () => {
      render(<DocumentsList {...defaultProps} />);
      expect(screen.getByDisplayValue('Todos los estados')).toBeInTheDocument();
    });

    it('should filter by status when selected', async () => {
      const user = userEvent.setup();
      render(<DocumentsList {...defaultProps} />);

      const select = screen.getByDisplayValue('Todos los estados');
      await user.selectOptions(select, 'PENDIENTE');

      expect(screen.getByText('Solicitud de información')).toBeInTheDocument();
      expect(screen.queryByText('Respuesta a derecho de petición')).not.toBeInTheDocument();
    });

    it('should show all status options', () => {
      render(<DocumentsList {...defaultProps} />);
      const select = screen.getByDisplayValue('Todos los estados');
      expect(select.querySelectorAll('option').length).toBeGreaterThan(1);
    });
  });

  describe('document interaction', () => {
    it('should call onViewDetail when a document card is clicked', () => {
      const onViewDetail = vi.fn();
      render(<DocumentsList {...defaultProps} onViewDetail={onViewDetail} />);

      fireEvent.click(screen.getByText('Solicitud de información'));
      expect(onViewDetail).toHaveBeenCalledWith(mockDocuments[0]);
    });
  });

  describe('deadline display', () => {
    it('should show days remaining for future deadlines', () => {
      render(<DocumentsList {...defaultProps} />);
      const elements = screen.getAllByText(/restantes/i);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should show vencido info for past deadlines', () => {
      render(<DocumentsList {...defaultProps} />);
      // "Vencido 5d" appears in deadline display
      expect(screen.getByText(/vencido \d+d/i)).toBeInTheDocument();
    });
  });
});
